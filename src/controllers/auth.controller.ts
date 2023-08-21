import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { checkUser, createUser } from '../models/user.model';
import { ErrorHandler } from '../utils/error.util';
import asyncWrapper from '../utils/async-error.util';
import { verify } from '../utils/jwt.util';

export const signup = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    // const regex = /^ [1-9]\\d {0,2}$/g;
    const schema = Joi.object({
      id: Joi.number().optional(),
      activityId: Joi.string().required(),
      username: Joi.string().min(3).max(30).required(),
      email: Joi.string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ['com', 'to', 'net'] },
        })
        .required(),
      password: Joi.string().required(),
      password_confirm: Joi.ref('password'),
    });

    const request = await schema.validateAsync(req.body);

    const token = await createUser({
      id: request.id,
      activityId: request.activityId,
      username: request.username,
      email: request.email,
      password: request.password,
    });

    res.status(201).json({
      status: 'success',
      token,
      message: 'user created!',
    });
  },
);

export const login = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      email: Joi.string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ['com', 'to', 'net'] },
        })
        .required(),
      password: Joi.string().required(),
    });

    const request = await schema.validateAsync(req.body);

    const token = await checkUser({
      email: request.email as string,
      password: request.password as string,
    });

    res.status(200).json({
      status: 'success',
      token,
      message: 'Login!',
    });
  },
);

export const auth = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    // Check token
    const isHeader: string | undefined = req.get('authorization');
    const isAuthorize: boolean = isHeader?.startsWith('Bearer') ?? false;

    let token: string | undefined;

    if (isAuthorize) {
      token = isHeader?.split(' ')[1];
    }

    if (token === undefined) {
      next(
        new ErrorHandler(
          'You are not logged in! Please log in to get access',
          401,
        ),
      );
    }

    // Verify token
    const tokenDecoded = await verify(token);
    console.log(tokenDecoded);
    next();
  },
);
