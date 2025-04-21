import { Router } from "express";
import { postsController } from "@/controllers/postsController.ts";

const postsRouter = Router();

postsRouter.get("/", postsController.getPosts);
postsRouter.get("/visible/:user_id", postsController.getVisiblePosts);
postsRouter.get("/:post_id", postsController.getPost);
postsRouter.post("/", postsController.createPost);
postsRouter.put("/:post_id", postsController.updatePost);
postsRouter.delete("/:post_id", postsController.deletePost);
postsRouter.post("/:postId/like", postsController.likePost);
postsRouter.post("/:postId/comments", postsController.addComment);

export default postsRouter;