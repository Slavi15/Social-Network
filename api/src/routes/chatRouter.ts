import { Router } from "express";
import { chatController } from "@/controllers/chatController.ts";

const chatRouter = Router();

chatRouter.post("/send", chatController.sendMessage);
chatRouter.get("/:user1/:user2", chatController.getMessages);

export default chatRouter;