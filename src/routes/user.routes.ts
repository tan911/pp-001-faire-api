import { Router } from 'express';

import {
  signup,
  login,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.controller';

const router: Router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

export default router;
