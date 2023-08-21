import { Router } from 'express';

import {
  createUserTask,
  getUserTask,
  updateUserTask,
  deleteUserTask,
} from '../controllers/task.controller';
import { auth } from '../controllers/auth.controller';

const router: Router = Router();

router.route('/').post(createUserTask);
router
  .route('/:id')
  .get(auth, getUserTask)
  .patch(updateUserTask)
  .delete(deleteUserTask);

export default router;
