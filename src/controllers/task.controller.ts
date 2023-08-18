import { NextFunction, Request, Response } from 'express';

import {
  createTask,
  getTask,
  updateTask,
  deleteTask,
} from '../models/task.model';
import asyncWrapper from '../utils/async-error.util';

export const createUserTask = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    await createTask({
      activityId: req.body.activityId,
      title: req.body.title,
      description: req.body.description,
    });
    res.status(201).json({
      status: 'success',
      message: 'Task created!',
    });
  },
);

export const getUserTask = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await getTask(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        data,
      },
    });
  },
);

export const updateUserTask = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    await updateTask({
      activityId: req.body.activityId,
      title: req.body.title,
      description: req.body.description,
    });

    res.status(200).json({
      status: 'success',
      message: 'Task updated!',
    });
  },
);

export const deleteUserTask = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    await deleteTask(req.params.id);

    res.status(204).json({
      status: 'success',
      message: 'Task deleted!',
    });
  },
);
