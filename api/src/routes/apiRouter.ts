import { Router } from "express";
import userRouter from "./userRouter.ts";
import postsRouter from "./postsRouter.ts";

const router = Router();

router.use("/users", userRouter);
router.use("/posts", postsRouter);

export default router;