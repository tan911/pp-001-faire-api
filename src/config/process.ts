import { ErrorHandler } from '@utils/error.util';
import logger from './logger.config';

process.on('unhandledRejection', (error: Error) => {
  logger.error(`Unhandled Rejection: ${error.message}`);
  throw new Error(error.message);
});

process.on('uncaughtException', (error: Error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
  throw new ErrorHandler(error.message, 500);
});
