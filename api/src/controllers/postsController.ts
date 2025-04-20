import { NextFunction, Request, Response } from "express";
import { PostModel } from "@/models/posts.ts";
import { UserModel } from "@/models/users.ts";
import { validatePost } from "@/validators/postsValidator.ts";
import { AppError, HttpCode } from "@/exceptions/AppError.ts";

class PostController {

    public getPosts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const posts = await PostModel.find()
                .populate("user_id", "username email")
                .populate({
                    path: "comments",
                    populate: {
                        path: "user_id",
                        select: "username email"
                    }
                });

            res.status(HttpCode.OK).json(posts);
        } catch (err) {
            next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Failed to fetch posts!"
            }));
        };
    };

    public getPost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { post_id } = req.params;
            const post = await PostModel.findById(post_id)
                .populate("user_id", "username email")
                .populate({
                    path: "comments",
                    populate: {
                        path: "user_id",
                        select: "username email"
                    }
                });

            if (!post) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Post not found!"
                }));
            }

            res.status(HttpCode.OK).json(post);
        } catch (err) {
            next(new AppError({
                httpCode: HttpCode.BAD_REQUEST,
                description: "Invalid post ID!"
            }));
        };
    };

    public createPost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { user_id, content, privacy } = req.body;

            const err = validatePost(req.body);
            if (err) {
                return next(new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "Invalid post data!"
                }));
            };

            const user = await UserModel.findById(user_id);
            if (!user) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "User not found!"
                }));
            };

            const newPost = await PostModel.create({
                user_id,
                content,
                privacy,
                likes: [],
                comments: []
            });

            res.status(HttpCode.CREATED).json(newPost);
        } catch (err) {
            console.log(err);

            next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error creating post!"
            }));
        };
    };

    public updatePost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { post_id } = req.params;

            const error = validatePost(req.body, true);

            if (error) {
                return next(new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: error
                }));
            };

            const updatedPost = await PostModel.findByIdAndUpdate(post_id, req.body, { new: true });

            if (!updatedPost) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Post not found!"
                }));
            };

            res.status(HttpCode.OK).json(updatedPost);
        } catch (error) {
            next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error updating post!"
            }));
        };
    };

    public deletePost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { post_id } = req.params;
            const deletedPost = await PostModel.findByIdAndDelete(post_id);

            if (!deletedPost) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Post not found!"
                }));
            };

            res.status(HttpCode.OK).json({ message: "Post deleted successfully!" });
        } catch (error) {
            next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error deleting post!"
            }));
        };
    };
};

export const postsController = new PostController();