import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { RowDataPacket } from 'mysql2/promise';

import logger from '@config/logger.config';
import { query } from '@utils/query.util';
import { ErrorHandler } from '@utils/error.util';
import { sign } from '@utils/jwt.util';
import { getValueByKey, Is } from '@utils/helper.util';
import hashedToken from '@utils/crypto.util';

interface User {
  id: number;
  activityId: string;
  username: string;
  email: string;
  password: string;
}

class UserModel {
  // HANDLE ERRORS
  private async errorWrapper<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error: unknown) {
      const errMessage: string =
        error instanceof ErrorHandler ? error.message : 'An error occured!';

      const errorStatus: number =
        error instanceof ErrorHandler ? error.statusCode : 500;

      logger.error(error);

      throw new ErrorHandler(errMessage, errorStatus, error);
    }
  }

  private async insertUser(info: User, password: string): Promise<void> {
    await query(
      ` INSERT INTO user (id, activity_id, username, email, password)
        VALUES (${info.id}, '${info.activityId}', '${info.username}', '${info.email}', '${password}')
      `,
    );
  }

  private async getUserType(
    get: string[],
    filterBy: string,
    param: string | number,
  ): Promise<RowDataPacket> {
    const columns: string = get.reduce((acc, curr, index): string => {
      if (index === 0) return curr;
      return `${acc ?? ''}, ${curr ?? ''}`;
    });

    return await query(
      ` SELECT ${columns} 
        FROM user 
        WHERE ${filterBy} = '${param}'`,
    );
  }

  private async updateUserPasswordReset(
    email: string,
    passwordResetToken: string | null,
    expiry: string | null,
  ): Promise<void> {
    const isToken =
      passwordResetToken !== null ? `'${passwordResetToken}'` : 'Null';
    const isExpiry = expiry !== null ? `'${expiry}'` : 'Null';

    await query(`
          UPDATE user 
          SET password_reset_token = ${isToken},
          password_reset_request_time = ${isExpiry}
          WHERE email = '${email}'
        `);
  }

  // CREATE USER FOR SIGN UP FUNCTIONALITY
  public async createUser(info: User): Promise<string> {
    return await this.errorWrapper(async () => {
      /**
       * check if exist on records
       * to avoid duplicated ids
       */
      const user = await this.getUserType(
        ['activity_id', 'password'],
        'activity_id',
        info.activityId,
      );

      const isId = getValueByKey(user as [], 'user_id');

      if (isId === Is.NotExist) {
        const password = await bcrypt.hash(info.password, 10);
        const generateToken = await sign({ id: info.activityId });

        // store user to db
        await this.insertUser(info, password);

        return generateToken;
      } else {
        throw new ErrorHandler('This user already exist.', 403);
      }
    });
  }

  // CHECK USER IF EXIST FOR LOGIN FUNCTIONALITY
  public async checkUser(info: {
    email: string;
    password: string;
  }): Promise<Record<string, string>> {
    return await this.errorWrapper(async () => {
      const columns = ['email', 'password', 'activity_id'];
      const user = await this.getUserType(columns, 'email', info.email);

      const getPassword = getValueByKey(user as [], 'password');
      const userId = getValueByKey(user as [], 'activity_id');
      const hashedPassword =
        getPassword === Is.NotExist ? Is.NotExist : getPassword;
      const isMatch = await bcrypt.compare(info.password, hashedPassword);

      if (isMatch) {
        const token = await sign({ id: userId, password: info.password });

        return { id: userId, token: token };
      } else {
        throw new ErrorHandler('Incorrect email or password!', 401);
      }
    });
  }

  // CHECK USER FOR PROTECTED ROUTES

  // ========== bugs
  public async isUser<T extends Record<string, string>>(
    column: string[],
    filter: string,
    param: string | number,
    isGetToken?: boolean,
  ): Promise<T> {
    return await this.errorWrapper(async () => {
      const user = await this.getUserType(column, filter, param);
      const userId = getValueByKey(user as [], 'activity_id');
      const userPassword = getValueByKey(user as [], 'password');

      if (isGetToken ?? false) {
        const passwordToken = getValueByKey(user as [], 'password_reset_token');
        const passwordTokenExpiry = getValueByKey(
          user as [],
          'password_reset_request_time',
        );
        console.log(user);
        return {
          password: passwordToken,
          expiry: passwordTokenExpiry,
        } as unknown as T;
      }

      return { id: userId, password: userPassword } as unknown as T;
    });
  }

  // CHECK EMAIL FOR RESET PASSWORD FUNCTIONALITY
  public async isEmail(
    email: string,
    isError?: Record<string, null>,
  ): Promise<string> {
    return await this.errorWrapper(async () => {
      const columns = ['email', 'password', 'activity_id'];
      const userEmail = await this.getUserType(columns, 'email', email);

      const isUserEmail: string | number = getValueByKey(
        userEmail as [],
        'email',
      );

      if (isUserEmail !== Is.NotExist && isError === undefined) {
        // generate the random reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const passwordResetToken = hashedToken(resetToken);

        /**
         * calculate the timestamp that depends
         * on env configuration of time
         * this will set a time as an expiration for token
         */
        const now: Date = new Date();
        const rawDate: Date = new Date(
          now.getTime() + Number(process.env.EMAIL_VALID_TIME) * 60 * 1000,
        );
        const stringDate: string = rawDate.toISOString();
        const expiry: string = stringDate
          .slice(0, stringDate.length - 1)
          .replace('T', ' ');

        // Store to db
        await this.updateUserPasswordReset(email, passwordResetToken, expiry);

        return resetToken;
      } else if (isError !== undefined) {
        await this.updateUserPasswordReset(
          email,
          isError.token,
          isError.expiry,
        );

        return 'There was an error sending the email.';
      } else {
        throw new ErrorHandler(
          'There is no user with this email address.',
          404,
        );
      }
    });
  }
}

export default new UserModel();
