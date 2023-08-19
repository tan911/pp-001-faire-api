import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger.config';

// eslint-disable-next-line
export default (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error(error.stack);
  logger.error(error);

  res.status(req.statusCode ?? 500).json({
    name: error.name,
    message: error.message,
  });
};
