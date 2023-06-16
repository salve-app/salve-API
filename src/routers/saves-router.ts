import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getAllSaveCategories } from "@/controllers/saves-controller";

const savesRouter = Router();

savesRouter
  .all("/*", authenticateToken)
  .get("/categories", getAllSaveCategories);

export { savesRouter };
