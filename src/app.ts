import 'dotenv/config';
import express, { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import chalk from 'chalk';

import taskRouter from './routes/task.routes';
import userRouter from './routes/user.routes';
import morgan from './middlewares/logger.middleware';
import globalError from './middlewares/app-error.middleware';
import { PageNotFound } from './utils/error.util';
import './config/process';

const app: Express = express();
const port = process.env.PORT ?? 3000;

app.use(morgan);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/faire/task', taskRouter);
app.use('/faire/user', userRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new PageNotFound(req.originalUrl));
});

app.use(globalError);

app.listen(port, () => {
  console.log(
    `Server running on: \t\t${chalk.bold.cyan(`http://localhost/${port}`)}`,
  );
});
