import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { profileSchema, userSchema } from "@/schemas";
import { createUser, createProfile, createAddress } from "@/controllers/users-controller";
import { addressInputSchema } from "@/schemas/addresses-schemas";

const usersRouter = Router();

usersRouter
  .post("/sign-up", validateBody(userSchema), createUser)
  .use(authenticateToken)
  .post("/sign-up/profile", validateBody(profileSchema), createProfile)
  .post("/sign-up/address", validateBody(addressInputSchema), createAddress);

export { usersRouter };
