import { RowDataPacket } from 'mysql2/promise';

import { query } from '@utils/query.util';
import { ErrorHandler } from '@utils/error.util';
import logger from '@config/logger.config';

interface Taskable {
  id: string;
  title: string;
  description: string;
  status: string;
}

class Task {
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

  private async insertTask(task: Taskable): Promise<void> {
    await query(`
      INSERT INTO user_activities (id, title, description, status)
      VALUES ('${task.id}', '${task.title}', '${task.description}', '${task.status}')
    `);
  }

  private async getTaskById(id: string): Promise<RowDataPacket> {
    return query(`
      SELECT ut.id, ut.title, ut.description,
      ut.status, ut.created_at, ut.updated_at,
      ut.completed_at
      FROM user_activities as ut 
      JOIN user ON user.activity_id = ut.id
      WHERE ut.id = '${id}'
    `);
  }

  private async updateTaskById(task: Taskable): Promise<void> {
    await query(`
      UPDATE user_activities 
      SET title = '${task.title}', 
      description = '${task.description}', 
      status = '${task.status}'
      WHERE id = '${task.id}'
    `);
  }

  private async deleteTaskById(id: string): Promise<void> {
    await query(`
      DELETE FROM user_activities WHERE id = '${id}'
    `);
  }

  public async createTask(task: Taskable): Promise<void> {
    await this.errorWrapper(async () => {
      await this.insertTask(task);
    });
  }

  public async getTask(user: { id: string }): Promise<Taskable> {
    return await this.errorWrapper(async () => {
      const response = await this.getTaskById(user.id);
      return response[0];
    });
  }

  public async updateTask(task: Taskable): Promise<void> {
    await this.errorWrapper(async () => {
      await this.updateTaskById(task);
    });
  }

  public async deleteTask(user: { id: string }): Promise<void> {
    await this.errorWrapper(async () => {
      await this.deleteTaskById(user.id);
    });
  }
}

export default new Task();
