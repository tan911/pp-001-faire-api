import { query } from '../utils/query.util';
import { ErrorHandler } from '../utils/error.util';

interface Taskable {
  id: string;
  title: string;
  description: string;
  status: string;
}

export async function createTask(task: Taskable): Promise<void> {
  try {
    await query(`
     INSERT INTO user_activities (id, title, description, status)
      VALUES ('${task.id}', '${task.title}', '${task.description}', '${task.status}')`);
  } catch (err) {
    throw new ErrorHandler('An error occured when creating a task', 500);
  }
}

export async function getTask(user: { id: string }): Promise<Taskable> {
  try {
    const response = await query(`
    SELECT ut.id, ut.title, ut.description,
    ut.status, ut.created_at, ut.updated_at,
    ut.completed_at
    FROM user_activities as ut 
    JOIN user ON user.activity_id = ut.id
    WHERE ut.id = '${user.id}'
    `);

    return response[0];
  } catch (err) {
    throw new ErrorHandler('An error occured when getting a task', 500);
  }
}

export async function updateTask(task: Taskable): Promise<void> {
  try {
    await query(`
      UPDATE user_activities SET title = '${task.title}', description = '${task.description}', status = '${task.status}'
      WHERE id = '${task.id}'
    `);
  } catch (err) {
    throw new ErrorHandler('An error occured when updating a task', 500);
  }
}

export async function deleteTask(user: { id: string }): Promise<void> {
  try {
    await query(`
      DELETE FROM user_activities WHERE id = '${user.id}'
    `);
  } catch (err) {
    throw new ErrorHandler('An error occured when deleting a task', 500);
  }
}
