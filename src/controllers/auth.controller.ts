import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Joi from 'joi';

import userschema from '@models/Users.model';
import asyncWrapper from '@utils/async-error.util';
import sendEmail from '@utils/email.util';
import { ErrorHandler } from '@utils/error.util';
import { verify } from '@utils/jwt.util';
import { Is } from '@utils/helper.util';
import logger from '@config/logger.config';

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

    const token = await userschema.createUser({
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

    const response: Record<string, string> = await userschema.checkUser({
      email: request.email as string,
      password: request.password as string,
    });

    res.status(200).json({
      status: 'success',
      token: response.token,
      id: response.id,
      message: 'Logged In!',
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
          'You are not logged in! Please log in to get access.',
          401,
        ),
      );
    }

    // Verify token
    const decodedToken: Record<string, string> | string = await verify(token);

    // Check user if exist
    let isUserExist: Record<string, string>;

    if (typeof decodedToken === 'string') {
      isUserExist = await userschema.isUser(decodedToken);
    } else {
      isUserExist = await userschema.isUser(decodedToken.id);
    }

    if (
      isUserExist.id === Is.NotExist ||
      isUserExist.password === Is.NotExist ||
      isUserExist.id !== req.body.id
    ) {
      next(new ErrorHandler('This user is no longer exist.', 401));
    }

    /**
     * Check if user password changed
     *
     * This step is to verify if the user changed his password
     * after the token was issued and also this is not relying
     * on the date when a password was changed. However, it utilizes
     * the bcrypt library comparison to ensure that, the password
     * is modified or not.
     */

    let isPasswordChanged: boolean;

    if (typeof decodedToken === 'string') {
      isPasswordChanged = await bcrypt.compare(
        decodedToken,
        isUserExist.password,
      );
    } else {
      isPasswordChanged = await bcrypt.compare(
        decodedToken.password,
        isUserExist.password,
      );
    }

    if (!isPasswordChanged) {
      next(
        new ErrorHandler(
          'Password has been changed! Please log in again.',
          401,
        ),
      );
    }

    next();
  },
);

// TODO
export const forgotPassword = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get user based on POSTed email

    const emailResetToken: string = await userschema.isEmail(req.body.email);
    const host: string | undefined = req.get('host');

    // Send it to user's email
    const resetURL = `${req.protocol}://${
      host ?? ''
    }/faire/users/resetPassword/${emailResetToken}`;

    const message = `Forgot password? Submit a PATCH request with your new password and
      password-confirm to: ${resetURL}.\n
      If you didn't forget your password, please ignore this email!
    `;

    try {
      await sendEmail({
        email: req.body.email,
        subject: `Your password reset token (Valid for ${
          process.env.EMAIL_VALID_TIME as string
        }mins)`,
        message,
      });

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email',
      });
    } catch (error) {
      const resMessage: string = await userschema.isEmail(req.body.email, {
        token: null,
        expiry: null,
      });
      logger.error(error);
      next(
        new ErrorHandler(
          `${resMessage ?? 'Email error.'} Try again later!`,
          500,
        ),
      );
    }
  },
);

export const resetPassword = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    //
  },
);
