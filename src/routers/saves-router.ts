import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import {
  createSave,
  getAllSaveCategories,
  getChatMessages,
  getNearbySaves,
  getMyActiveSaves,
  getSaveChatList,
  createChatMessage,
} from "@/controllers/saves-controller";

const savesRouter = Router();

savesRouter
  .all("/*", authenticateToken)
  .get("/categories", getAllSaveCategories)
  .get("/", getNearbySaves)
  .get("/me/active", getMyActiveSaves)
  .get("/:id/chat", getChatMessages)
  .get("/:id/chat/list", getSaveChatList)
  .post("/", createSave)
  .post("/:id/chat", createChatMessage);

export { savesRouter };
