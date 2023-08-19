import 'dotenv/config';
import express, { Express, Request, Response, NextFunction } from 'express';
import chalk from 'chalk';

import taskRouter from './routes/task.routes';
import userRouter from './routes/user.routes';
import morgan from './middlewares/logger.middleware';
import globalError from './middlewares/app-error.middleware';
import { appUrlencoded, appJSON } from './middlewares/body-parser.middleware';
import { PageNotFound } from './utils/error.util';
import './config/process';

const app: Express = express();
const port = process.env.PORT ?? 3000;

// MIDDLEWARE
app.use(morgan);
app.use(appUrlencoded);
app.use(appJSON);

// ROUTES
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
