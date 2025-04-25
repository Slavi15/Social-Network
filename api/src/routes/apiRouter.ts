import { Router } from "express";
import userRouter from "./userRouter";
import postsRouter from "./postsRouter";
import eventsRouter from "./eventsRouter";
import friendsRouter from "./friendsRouter";
import authRouter from "./authRouter";
import uploadRouter from "./uploadRouter";
import { ChatController } from "@/controllers/chatController";
import { createChatRouter } from "./chatRouter";

export function createApiRouter(chatController: ChatController) {
    const router = Router();
    const chatRouter = createChatRouter(chatController);

    router.use("/users", userRouter);
    router.use("/auth", authRouter);
    router.use("/posts", postsRouter);
    router.use("/events", eventsRouter);
    router.use("/friends", friendsRouter);
    router.use("/chats", chatRouter);
    router.use("/upload", uploadRouter);

    return router;
}