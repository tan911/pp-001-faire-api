import bcrypt from 'bcrypt';
import { query } from '../utils/query.util';
import { ErrorHandler } from '../utils/error.util';
import logger from '../config/logger.config';
import { sign } from '../utils/jwt.util';

interface User {
  id: number;
  activityId: string;
  username: string;
  email: string;
  password: string;
}

async function passwordHash(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function createUser(info: User): Promise<string> {
  try {
    /**
     * count user id
     * to check if exist on records
     */
    const [user] = await query(
      `SELECT COUNT(activity_id) AS user_id FROM user WHERE activity_id = '${info.activityId}'`,
    );

    if (user[0].user_id === 0) {
      const password = await passwordHash(info.password);
      const generateToken = await sign({ id: info.activityId });

      // store user to db
      await query(`
      INSERT INTO user (id, activity_id, username, email, password)
      VALUES (${info.id}, '${info.activityId}', '${info.username}', '${info.email}', '${password}')
      `);

      return generateToken;
    } else {
      throw new ErrorHandler('This user already exist.', 500);
    }
  } catch (error: unknown) {
    const errMessage: string =
      error instanceof Error ? error.message : 'An error occured!';

    logger.error(error);
    throw new ErrorHandler(errMessage, 500, error);
  }
}
