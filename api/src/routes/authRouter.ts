import { Router } from "express";
import { authController } from "@/controllers/authController";

const authRouter = Router();

authRouter.post("/login", authController.login);
authRouter.post("/register", authController.register);
authRouter.post("/logout", authController.logout);
authRouter.post("/refresh", authController.refresh);

export default authRouter;