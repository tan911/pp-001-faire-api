import { Router } from 'express';

import { signup } from '../controllers/auth.controller';

const router: Router = Router();

router.route('/signup').post(signup);

export default router;
