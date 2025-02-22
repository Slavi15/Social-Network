import { Router } from "express";
import { usersController } from "@/controllers/usersController.ts";

const userRouter = Router();

userRouter.get("/", usersController.getUsers);
userRouter.get("/:id", usersController.getUser);
userRouter.post("/", usersController.createUser);
userRouter.put("/:id", usersController.updateUser);
userRouter.delete("/:id", usersController.deleteUser);

export default userRouter;