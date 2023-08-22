import bcrypt from 'bcrypt';
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
}): Promise<string> {
  try {
    const user = await query(`
      SELECT email, password FROM user WHERE email = '${info.email}'
    `);
    const getPassword = getValueByKey(user as [], 'password');
    const hashedPassword =
      getPassword === Is.NotExist ? Is.NotExist : getPassword;
    const isMatch = await bcrypt.compare(info.password, hashedPassword);

    if (isMatch) {
      return await sign({ email: info.email });
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

export async function isUser(email: string): Promise<string> {
  try {
    const user = await query(`
      SELECT COUNT(activity_id) as user_id FROM user WHERE email = ${email} 
     `);

    return getValueByKey(user as [], 'user_id');
  } catch (error) {
    logger.error(error);
    throw new ErrorHandler('An error occured', 500);
  }
}
