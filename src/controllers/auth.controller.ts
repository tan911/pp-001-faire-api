import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { createUser } from '../models/user.model';
import asyncWrapper from '../utils/async-error.util';

export const signup = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    // const regex = /^ [1-9]\\d {0,2}$/g;
    const schema = Joi.object({
      id: Joi.number().optional(),
      activityId: Joi.string().optional(),
      username: Joi.string().min(3).max(30).required(),
      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'to', 'net'] },
      }),
      password: Joi.string(),
      password_confirm: Joi.ref('password'),
    });

    const newUser = await schema.validateAsync(req.body);
    console.log(newUser);
    await createUser(newUser);

    res.status(201).json({
      status: 'success',
      message: 'user created!',
    });
  },
);
