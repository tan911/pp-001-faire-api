import morgan, { StreamOptions } from 'morgan';
// import { Request, Response } from 'express';
import logger from '../config/logger.config';

const stream: StreamOptions = {
  write: message => logger.http(message),
};

const morganFormat: string =
  process.env.NODE_ENV !== 'production' ? 'dev' : 'combined';

const skip = (): boolean => {
  const env = process.env.NODE_ENV ?? 'production';
  return env === 'production';
};

const morganLogger = morgan(morganFormat, {
  skip,
  stream,
});

export default morganLogger;
