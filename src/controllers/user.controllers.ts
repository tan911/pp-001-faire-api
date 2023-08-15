import { NextFunction, Request, Response } from 'express';

import { createUserData, getUserData } from '../models/user.model';
import asyncWrapper from '../utils/async-error.util';

export const createUserTask = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await createUserData({
      activityId: req.body.activityId,
      title: req.body.title,
      description: req.body.description,
    });
    res.status(201).json({
      status: 'success',
      data: {
        data,
      },
    });
  },
);

export const getUserTask = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await getUserData(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        data,
      },
    });
  },
);
