import morgan, { StreamOptions } from 'morgan';
import { Request, Response } from 'express';
import logger from '../config/logger.config';

const stream: StreamOptions = {
  write: message => logger.http(message),
};

const morganFormat: string =
  process.env.NODE_ENV !== 'production' ? 'dev' : 'combined';

const skip = (req: Request, res: Response): boolean => {
  return res.statusCode < 400;
};

const method = morgan(morganFormat, {
  skip,
  stream,
});

export default method;
