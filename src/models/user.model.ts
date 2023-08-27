import bcrypt from 'bcrypt';
import crypto from 'crypto';
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

export async function createUser(info: User): Promise<string> {
  try {
    /**
     * check if exist on records
     * to avoid duplicated ids
     */
    const user = await query(
      `SELECT activity_id AS user_id FROM user WHERE activity_id = '${info.activityId}'`,
    );
    const isId = getValueByKey(user as [], 'user_id');

    if (isId === Is.NotExist) {
      const password = await bcrypt.hash(info.password, 10);
      const generateToken = await sign({ id: info.activityId });

      // store user to db
      await query(`
      INSERT INTO user (id, activity_id, username, email, password)
      VALUES (${info.id}, '${info.activityId}', '${info.username}', '${info.email}', '${password}')
      `);

      return generateToken;
    } else {
      throw new ErrorHandler('This user already exist.', 403);
    }
  } catch (error: unknown) {
    const errMessage: string =
      error instanceof Error ? error.message : 'An error occured!';

    logger.error(error);
    throw new ErrorHandler(errMessage, 403, error);
  }
}

export async function checkUser(info: {
  email: string;
  password: string;
}): Promise<Record<string, string>> {
  try {
    const user = await query(`
      SELECT email, password, activity_id FROM user WHERE email = '${info.email}'
    `);
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
  } catch (error: unknown) {
    const errMessage: string =
      error instanceof Error ? error.message : 'An error occured!';

    logger.error(error);
    throw new ErrorHandler(errMessage, 401, error);
  }
}

export async function isUser(id: string): Promise<Record<string, string>> {
  try {
    const user = await query(`
      SELECT activity_id as user_id, password as user_password FROM user WHERE activity_id = '${id}' 
     `);
    const userId = getValueByKey(user as [], 'user_id');
    const userPassword = getValueByKey(user as [], 'user_password');

    return { id: userId, password: userPassword };
  } catch (error) {
    logger.error(error);
    throw new ErrorHandler('An error occured', 500);
  }
}

export async function isEmail(email: string): Promise<string> {
  try {
    const userEmail = await query(`
      SELECT email FROM user WHERE email = '${email}' 
    `);

    const isUserEmail: string | number = getValueByKey(
      userEmail as [],
      'email',
    );

    if (isUserEmail !== Is.NotExist) {
      // Generate the random reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

      // Calculate the timestamp 10 mins from now
      // This will set expiration for token
      const now: Date = new Date();
      const rawDate: Date = new Date(now.getTime() + 10 * 60 * 1000);
      const stringDate: string = rawDate.toISOString();
      const expiry: string = stringDate
        .slice(0, stringDate.length - 1)
        .replace('T', ' ');

      // Store to db
      await query(`
        UPDATE user 
        SET password_reset_token = '${passwordResetToken}',
        password_reset_request_time = '${expiry}'
        WHERE email = '${email}'
      `);

      return resetToken;
    } else {
      throw new ErrorHandler('There is no user with this email address.', 404);
    }
  } catch (error: unknown) {
    const errMessage: string =
      error instanceof Error ? error.message : 'An error occured!';

    logger.error(error);
    throw new ErrorHandler(errMessage, 404, error);
  }
}
