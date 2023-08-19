import { query } from '../utils/query.util';
import { ErrorHandler } from '../utils/error.util';

interface User {
  id: number;
  activityId: string;
  username: string;
  email: string;
  password: string;
}

export async function createUser(info: User): Promise<void> {
  try {
    await query(`INSERT INTO user (id, activity_id, username, email, password)
			VALUES (${info.id}, '${info.activityId}', '${info.username}', '${info.email}', '${info.password}')
		`);
  } catch (err) {
    throw new ErrorHandler('An error occured when creating a user', 500, err);
  }
}
