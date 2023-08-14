import { query } from '../utils/query.util';
import ErrorHandler from '../utils/error.util';

interface UserInfo {
  id: number;
  user_id: string;
  username: string;
  created_at: Date;
  updated_at: Date;
}

export async function getUserInfo(): Promise<UserInfo> {
  try {
    const response = await query('SELECT * FROM account');
    return response;
  } catch (err) {
    throw new ErrorHandler('An error occured', 400);
  }
}
