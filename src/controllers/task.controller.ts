import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import {
  createTask,
  getTask,
  updateTask,
  deleteTask,
} from '../models/task.model';
import asyncWrapper from '../utils/async-error.util';

export const createUserTask = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      id: Joi.string().required(),
      title: Joi.string().min(5).max(25).required(),
      description: Joi.string().max(30).required(),
      status: Joi.string().required(),
    });

    const request = await schema.validateAsync(req.body);

    await createTask({
      id: request.id,
      title: request.title,
      description: request.description,
      status: request.status,
    });

    res.status(201).json({
      status: 'success',
      message: 'Task successfully created!',
    });
  },
);

export const getUserTask = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      id: Joi.string().required(),
    });

    const userTask = await schema.validateAsync(req.body);

    const data = await getTask({
      id: userTask.id,
    });

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
    const schema = Joi.object({
      id: Joi.string().required(),
      title: Joi.string().min(5).max(25).required(),
      description: Joi.string().max(30).required(),
      status: Joi.string().required(),
    });

    const request = await schema.validateAsync(req.body);

    await updateTask({
      id: request.id,
      title: request.title,
      description: request.description,
      status: request.status,
    });

    res.status(200).json({
      status: 'success',
      message: 'Task updated!',
    });
  },
);

export const deleteUserTask = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      id: Joi.string().required(),
    });

    const user = await schema.validateAsync(req.params);

    await deleteTask({
      id: user.id,
    });

    res.status(204).json({
      status: 'success',
      message: 'Task deleted!',
    });
  },
);
