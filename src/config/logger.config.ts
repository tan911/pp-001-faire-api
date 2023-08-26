import winston, { createLogger } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logger = createLogger({
  level: 'verbose',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH-mm-ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.printf(
      ({ timestamp, level, message }) =>
        // eslint-disable-next-line
        `${timestamp} ${level}: ${message}`,
    ),
  ),
  transports: [
    new DailyRotateFile({
      filename: 'logger/logs/%DATE%.log',
      datePattern: 'YYYY-MM-DD',
    }),
    new winston.transports.Console(),
  ],
});

export default logger;
