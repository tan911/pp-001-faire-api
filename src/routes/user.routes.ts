import { Router } from 'express';

import { signup, login, forgotPassword } from '../controllers/auth.controller';

const router: Router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);

export default router;
