import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import {
  createSave,
  getAllSaveCategories,
  getOfferingSaves,
  getRequestedSaves,
} from "@/controllers/saves-controller";

const savesRouter = Router();

savesRouter
  .all("/*", authenticateToken)
  .get("/categories", getAllSaveCategories)
  .post("/", createSave)
  .get("/requested", getRequestedSaves)
  .get("/offering", getOfferingSaves);

export { savesRouter };
