import { Router } from 'express';

import { getUser } from '../controllers/user.controllers';

const router: Router = Router();

router.route('/').get(getUser);

export default router;
