import { Router } from 'express';
const router: Router = Router();

import * as controller from '../controllers/task.controller';

import * as validation from '../validations/task.validate';

router.get("/", controller.index);

router.get("/detail/:id", controller.detail);

router.patch("/change-status/:id", controller.changeStatus);

router.patch("/change-multi", validation.changeMulti, controller.changeMulti);

router.post("/create", controller.create);

router.patch("/edit/:id", controller.edit);

export const taskRoutes: Router = router;