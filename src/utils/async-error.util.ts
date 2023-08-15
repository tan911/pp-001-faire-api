import { Request, Response, NextFunction } from 'express';

/**
 * catch error in async operations
 *
 */
export default (asyncWrapper: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    asyncWrapper(req, res, next).catch((err: Error) => {
      next(err);
    });
  };
};
