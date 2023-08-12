import { Router } from 'express';

import { getTask } from '../controllers/user.controllers';

const userRouter: Router = Router();

userRouter.route('/').get(getTask);

export { userRouter };
