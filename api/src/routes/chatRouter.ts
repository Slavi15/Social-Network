import { Router } from "express";
import { ChatController } from "@/controllers/chatController";

export function createChatRouter(chatController: ChatController) {
    const chatRouter = Router();

    chatRouter.get("/users/:userId", chatController.getChats.bind(chatController));
    chatRouter.get("/:chatId/users/:userId", chatController.getChat.bind(chatController));

    chatRouter.post("/create/:participantId/users/:userId", chatController.createChat.bind(chatController));

    chatRouter.get("/:chatId/users/:userId/messages", chatController.getMessages.bind(chatController));
    chatRouter.post("/send/:chatId/users/:userId/messages", chatController.sendMessage.bind(chatController));

    return chatRouter;
}