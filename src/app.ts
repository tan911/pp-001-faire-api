import 'dotenv/config';
import express, { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import chalk from 'chalk';

import userRouter from './routes/user.routes';
import logger from './middlewares/logger.middleware';
import ErrorHandler from './utils/error.util';

const app: Express = express();

const port = process.env.PORT ?? 3000;

app.use(logger);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'home',
  });
});

app.use('/faire/user', userRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new ErrorHandler(`Cant't find ${req.originalUrl} on this server`, 404));
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    stats: 'fail',
    message: err.message,
  });
});

app.listen(port, () => {
  console.log(
    `Server running on: ${chalk.bold.cyan(`http://localhost/${port}`)}`,
  );
});
