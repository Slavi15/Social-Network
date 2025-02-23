import { Router } from "express";
import { postsController } from "@/controllers/postsController.ts";

const postsRouter = Router();

postsRouter.get("/", postsController.getPosts);
postsRouter.get("/:post_id", postsController.getPost);
postsRouter.post("/", postsController.createPost);
postsRouter.put("/:post_id", postsController.updatePost);
postsRouter.delete("/:post_id", postsController.deletePost);

export default postsRouter;