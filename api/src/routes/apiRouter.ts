import { Router } from "express";
import userRouter from "./userRouter.ts";

const router = Router();

router.use("/users", userRouter);

export default router;