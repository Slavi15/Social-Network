import { Router } from "express";
import userRouter from "./userRouter.ts";
import postsRouter from "./postsRouter.ts";
import eventsRouter from "./eventsRouter.ts";
import friendsRouter from "./friendsRouter.ts";
import chatRouter from "./chatRouter.ts";
import authRouter from "./authRouter.ts";
import uploadRouter from "./uploadRouter.ts";

const router = Router();

router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/posts", postsRouter);
router.use("/events", eventsRouter);
router.use("/friends", friendsRouter);
router.use("/chats", chatRouter);
router.use("/upload", uploadRouter);

export default router;