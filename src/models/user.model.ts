import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { RowDataPacket } from 'mysql2/promise';

import logger from '../config/logger.config';
import { query } from '../utils/query.util';
import { ErrorHandler } from '../utils/error.util';
import { sign } from '../utils/jwt.util';
import { getValueByKey, Is } from '../utils/helper.util';

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

  private async getUserById(id: string): Promise<RowDataPacket> {
    return await query(
      ` SELECT activity_id, password 
        FROM user 
        WHERE activity_id = '${id}'`,
    );
  }

  private async getUserByEmail(email: string): Promise<RowDataPacket> {
    return await query(
      ` SELECT email, password, activity_id 
        FROM user WHERE email = '${email}'`,
    );
  }

  private async updateUserPasswordReset(
    passwordResetToken: string,
    expiry: string,
    email: string,
  ): Promise<void> {
    await query(`
        UPDATE user 
        SET password_reset_token = '${passwordResetToken}',
        password_reset_request_time = '${expiry}'
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
      const user = await this.getUserById(info.activityId);

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
      const user = await this.getUserByEmail(info.email);

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
  public async isUser(id: string): Promise<Record<string, string>> {
    return await this.errorWrapper(async () => {
      const user = await this.getUserById(id);
      const userId = getValueByKey(user as [], 'activity_id');
      const userPassword = getValueByKey(user as [], 'password');

      return { id: userId, password: userPassword };
    });
  }

  // CHECK EMAIL FOR RESET PASSWORD FUNCTIONALITY
  public async isEmail(email: string): Promise<string> {
    return await this.errorWrapper(async () => {
      const userEmail = await this.getUserByEmail(email);

      const isUserEmail: string | number = getValueByKey(
        userEmail as [],
        'email',
      );

      if (isUserEmail !== Is.NotExist) {
        // generate the random reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const passwordResetToken = crypto
          .createHash('sha256')
          .update(resetToken)
          .digest('hex');

        // calculate the timestamp 10 mins from now
        // this will set expiration for token
        const now: Date = new Date();
        const rawDate: Date = new Date(now.getTime() + 10 * 60 * 1000);
        const stringDate: string = rawDate.toISOString();
        const expiry: string = stringDate
          .slice(0, stringDate.length - 1)
          .replace('T', ' ');

        // Store to db
        await this.updateUserPasswordReset(passwordResetToken, expiry, email);

        return resetToken;
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
