import { query } from '../utils/query.util';
import ErrorHandler from '../utils/error.util';

interface Task {
  activityId: string;
  title: string;
  description: string;
}

export async function createUserData(task: Task): Promise<Task> {
  try {
    const response = await query(`
     INSERT INTO user_activities (activity_id, title, description) 
      VALUES ('${task.activityId}', '${task.title}', '${task.description}')`);
    return response;
  } catch (err) {
    throw new ErrorHandler('An error occured when creating a task', err, 500);
  }
}

export async function getUserData(id: string): Promise<Task> {
  try {
    const response = await query(`SELECT * FROM user_activities WHERE
      activity_id = '${id}'
    `);
    return response[0];
  } catch (err) {
    throw new ErrorHandler('An error occured when getting a task', err, 500);
  }
}
