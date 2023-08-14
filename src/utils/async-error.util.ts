import { Request, Response, NextFunction } from 'express';

export default (asyncWrapper: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    asyncWrapper(req, res, next).catch((err: Error) => {
      next(err);
    });
  };
};
