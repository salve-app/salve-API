import { Router } from "express";
import { validateBody } from "@/middlewares";
import { signInSchema } from "@/schemas";
import { singIn } from "@/controllers/auth-controller";

const authRouter = Router();

authRouter.post("/sign-in", validateBody(signInSchema), singIn);

export { authRouter };
