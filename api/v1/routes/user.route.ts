import { Router } from 'express';
const router: Router = Router();

import * as controller from '../controllers/user.controller';
import * as validation from '../validations/user.validate';

router.post("/register", validation.register, controller.register);

export const userRoutes: Router = router;