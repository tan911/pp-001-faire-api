import { Router } from 'express';

import {
  createUserTask,
  getUserTask,
  updateUserTask,
  deleteUserTask,
} from '../controllers/task.controller';

const router: Router = Router();

router.route('/').post(createUserTask);
router
  .route('/:id')
  .get(getUserTask)
  .patch(updateUserTask)
  .delete(deleteUserTask);

export default router;
