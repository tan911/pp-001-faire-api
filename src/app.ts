import 'dotenv/config';
import express, { Express, Request, Response } from 'express';
import chalk from 'chalk';

import { userRouter } from './routes/user.routes';
import morganMiddleWare from './middlewares/morgan.middleware';
import ErrorHandler from './utils/error';

const app: Express = express();

const port = process.env.PORT ?? 3000;
app.use(morganMiddleWare);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'home',
  });
});

app.use('/faire/user', userRouter);

app.all('*', (req, res, next) => {
  next(new ErrorHandler(`Cant't ${req.originalUrl} on this server`, 404));
});

// app.use((err, req: Request, res: Response, next: NextFunction) => {
//   err.statusCode = err.statusCode ?? 500;
//   err.status = err.status ?? 'error';

//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message,
//   });
// });

app.listen(port, () => {
  console.log(
    `Server running on: ${chalk.bold.cyan(`http://localhost/${port}`)}`,
  );
});
