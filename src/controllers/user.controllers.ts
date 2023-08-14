import { NextFunction, Request, Response } from 'express';

import { getUserInfo } from '../models/user.model';
import asyncWrapper from '../utils/async-error.util';

export const getUser = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await getUserInfo();
    res.status(200).json({
      status: 'success',
      data: {
        data,
      },
    });
  },
);

// export function getUser(req: Request, res: Response): void {
//   void (async function (): Promise<void> {
//     try {
//       const data = await getUserInfo();
//       res.status(200).json({
//         status: 'success',
//         data: {
//           data,
//         },
//       });
//     } catch (err) {
//       res.status(400).json({
//         status: 'Fail',
//         message: err,
//       });
//     }
//   })();
// }
