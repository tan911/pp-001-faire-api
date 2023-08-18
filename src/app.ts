import 'dotenv/config';
import express, { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import chalk from 'chalk';

import userRouter from './routes/task.routes';
import logger from './middlewares/logger.middleware';
import { PageNotFound } from './utils/error.util';
import './config/process';

const app: Express = express();
const port = process.env.PORT ?? 3000;

app.use(logger);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/faire/user', userRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new PageNotFound(req.originalUrl));
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: 'fail',
    message: err.message,
  });
});

app.listen(port, () => {
  console.log(
    `Server running on: \t\t${chalk.bold.cyan(`http://localhost/${port}`)}`,
  );
});
