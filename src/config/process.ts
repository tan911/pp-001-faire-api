import { ErrorHandler } from '../utils/error.util';

process.on('unhandledRejection', (error: Error) => {
  console.log(`Unhandled Rejection: ${error.message}`);
  throw new Error(error.message);
});

process.on('uncaughtException', (error: Error) => {
  console.log(`Uncaught Exception: ${error.message}`);
  throw new ErrorHandler(error.message, 500);
});
