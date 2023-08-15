import { Router } from 'express';

import { createUserTask, getUserTask } from '../controllers/user.controllers';

const router: Router = Router();

router.route('/').post(createUserTask);
router.route('/:id').get(getUserTask);

export default router;
