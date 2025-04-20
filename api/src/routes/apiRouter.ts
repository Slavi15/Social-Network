import { Router } from "express";
import userRouter from "./userRouter.ts";
import postsRouter from "./postsRouter.ts";
import eventsRouter from "./eventsRouter.ts";
import friendRequestsRouter from "./friendRequestsRouter.ts";
import chatRouter from "./chatRouter.ts";
import authRouter from "./authRouter.ts";
import uploadRouter from "./uploadRouter.ts";

const router = Router();

router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/posts", postsRouter);
router.use("/events", eventsRouter);
router.use("/requests", friendRequestsRouter);
router.use("/chats", chatRouter);
router.use("/upload", uploadRouter);

export default router;