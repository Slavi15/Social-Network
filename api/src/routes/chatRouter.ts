import { Router } from "express";
import { ChatController } from "@/controllers/chatController";

export function createChatRouter(chatController: ChatController) {
    const chatRouter = Router();

    chatRouter.get("/chats/users/:userId", chatController.getChats.bind(chatController));
    chatRouter.get("/chats/:chatId/users/:userId", chatController.getChat.bind(chatController));
    chatRouter.post("/chats/:participantId/users/:userId", chatController.createChat.bind(chatController));
    chatRouter.get("/chats/:chatId/users/:userId/messages", chatController.getMessages.bind(chatController));
    chatRouter.post("/chats/:chatId/users/:userId/messages", chatController.sendMessage.bind(chatController));

    return chatRouter;
}