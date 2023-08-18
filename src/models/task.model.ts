import { query } from '../utils/query.util';
import { ErrorHandler } from '../utils/error.util';

interface Task {
  activityId: string;
  title: string;
  description: string;
}

export async function createTask(task: Task): Promise<void> {
  try {
    await query(`
     INSERT INTO user_activities (activity_id, title, description)
      VALUES ('${task.activityId}', '${task.title}', '${task.description}')`);
  } catch (err) {
    throw new ErrorHandler('An error occured when creating a task', 500);
  }
}

export async function getTask(id: string): Promise<Task> {
  try {
    const response = await query(`SELECT * FROM user_activities WHERE
      activity_id = '${id}'
    `);
    return response[0];
  } catch (err) {
    throw new ErrorHandler('An error occured when getting a task', 500);
  }
}

export async function updateTask(task: Task): Promise<void> {
  try {
    await query(`
      UPDATE user_activities SET title = '${task.title}', description = '${task.description}'
      WHERE activity_id = '${task.activityId}'
    `);
  } catch (err) {
    throw new ErrorHandler('An error occured when updating a task', 500);
  }
}

export async function deleteTask(id: string): Promise<void> {
  try {
    await query(`
      DELETE FROM user_activities WHERE activity_id = '${id}'
    `);
  } catch (err) {
    throw new ErrorHandler('An error occured when deleting a task', 500);
  }
}
