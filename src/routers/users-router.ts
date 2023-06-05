import { Router } from 'express';
import { validateBody } from '@/middlewares';
import { userSchema } from '@/schemas';
import { create } from '@/controllers/users-controller';

const usersRouter = Router();

usersRouter.post('/signup', validateBody(userSchema), create);

export { usersRouter };
