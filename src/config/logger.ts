import winston from 'winston';
import chalk from 'chalk';

const level = (): string => {
  const env = process.env.NODE_ENV ?? 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'blue',
  debug: 'white',
};

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

winston.addColors(colors);

const Logger = winston.createLogger({
  level: level(),
  levels,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
      info => `${info.timestamp} [${info.level}]: ${info.message}`,
    ),
  ),
  transports: [new winston.transports.Console()],
});

export default Logger;
