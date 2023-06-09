import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { profileSchema, userSchema } from "@/schemas";
import { createUser, createProfile } from "@/controllers/users-controller";

const usersRouter = Router();

usersRouter
  .post("/sign-up", validateBody(userSchema), createUser)
  .use(authenticateToken)
  .post("/sign-up/profile", validateBody(profileSchema), createProfile);

export { usersRouter };
