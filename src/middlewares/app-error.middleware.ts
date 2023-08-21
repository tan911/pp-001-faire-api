import { Request, Response, NextFunction } from 'express';
import { ErrorHandler } from 'utils/error.util';
import logger from '../config/logger.config';

// eslint-disable-next-line
export default (
  error: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error(error.stack);
  logger.error(error);

  res.status(error.statusCode ?? 500).json({
    status: 'Fail',
    error: {
      statusCode: error.statusCode,
      status: 'fail',
      isOperational: error.isOperational,
    },
    name: error.name,
    message: error.message,
    stack: error.stack,
  });
};
