import { Request, Response } from 'express';

export const getTask = (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      status: 'success',
      data: {
        data: 'data',
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err,
    });
  }
};
