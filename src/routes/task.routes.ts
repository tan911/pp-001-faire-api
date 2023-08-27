import { Router } from 'express';

import {
  createUserTask,
  getUserTask,
  updateUserTask,
  deleteUserTask,
} from '../controllers/task.controller';
import { auth } from '../controllers/auth.controller';

const router: Router = Router();

router.route('/').get(auth, getUserTask).post(createUserTask);
router.route('/:id').patch(updateUserTask).delete(auth, deleteUserTask);

export default router;
