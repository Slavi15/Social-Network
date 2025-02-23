import { Router } from "express";
import { usersController } from "@/controllers/usersController.ts";

const userRouter = Router();

userRouter.get("/", usersController.getUsers);
userRouter.get("/:user_id", usersController.getUser);
userRouter.post("/", usersController.createUser);
userRouter.put("/:user_id", usersController.updateUser);
userRouter.delete("/:user_id", usersController.deleteUser);

export default userRouter;