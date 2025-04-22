import { Router } from "express";
import { postsController } from "@/controllers/postsController.ts";
import { authenticate } from "@/middleware/auth";

const postsRouter = Router();

postsRouter.get("/", postsController.getPosts);
postsRouter.get("/:user_id", postsController.getUserPosts);
postsRouter.get("/visible/:user_id", postsController.getVisiblePosts);
postsRouter.get("/:post_id", postsController.getPost);
postsRouter.post("/", postsController.createPost);
postsRouter.put("/:post_id", postsController.updatePost);
postsRouter.delete("/:post_id", postsController.deletePost);

postsRouter.put("/:postId/like", postsController.likePost);

postsRouter.post("/:postId/comments", postsController.addComment);
postsRouter.put("/:postId/comments/:commentId", authenticate, postsController.editComment);
postsRouter.delete("/:postId/comments/:commentId", authenticate, postsController.deleteComment);

export default postsRouter;