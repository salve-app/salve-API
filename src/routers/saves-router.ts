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
  updateSaveStatusToInProgress,
  updateSaveStatusToComplete,
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
  .post("/:id/chat", createChatMessage)
  .put("/:id/start", updateSaveStatusToInProgress)
  .put("/:id/finish", updateSaveStatusToComplete);

export { savesRouter };
