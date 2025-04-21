import { Types } from "mongoose";
import { NextFunction, Request, Response } from "express";
import { IComment, PostModel } from "@/models/posts.ts";
import { UserModel } from "@/models/users.ts";
import { validatePost } from "@/validators/postsValidator.ts";
import { AppError, HttpCode } from "@/exceptions/AppError.ts";

export enum Privacy {
    PUBLIC = 0b001,
    FRIENDS = 0b010,
    PRIVATE = 0b100,
};

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
                    },
                    options: {
                        sort: { createdAt: -1 }
                    }
                })
                .sort({ createdAt: -1 });

            res.status(HttpCode.OK).json(posts);
        } catch (err) {
            next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Failed to fetch posts!"
            }));
        };
    };

    public getVisiblePosts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { user_id } = req.params;
            const user = await UserModel.findById(user_id);

            if (!user) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "User not found!"
                }));
            }

            const posts = await PostModel.find({
                $or: [
                    { privacy: Privacy.PUBLIC },
                    {
                        privacy: Privacy.FRIENDS,
                        user_id: { $in: user.friends }
                    },
                    { user_id }
                ]
            })
                .sort({ createdAt: -1 })
                .populate("user_id", "username profile_picture")
                .populate({
                    path: "comments.user_id",
                    select: "username profile_picture"
                });

            const sortedComments = posts.map(post => ({
                ...post,
                comments: post.comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            }));

            res.status(HttpCode.OK).json(posts);
        } catch (err) {
            next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Failed to fetch visible posts!"
            }));
        }
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
                    },
                    options: {
                        sort: { createdAt: -1 }
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
            const { user_id, content, media, privacy } = req.body;

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

            const postData: any = {
                user_id,
                content,
                privacy,
                likes: [],
                comments: []
            };

            if (media && media.url && media.delete_url && media.filename) {
                postData.media = {
                    url: media.url,
                    delete_url: media.delete_url,
                    filename: media.filename
                };
            }

            const newPost = await PostModel.create(postData);
            res.status(HttpCode.CREATED).json(newPost);
        } catch (err) {
            return next(new AppError({
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

    public likePost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { postId } = req.params;
            const { userId } = req.body;

            const post = await PostModel.findById(postId);
            if (!post) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Post not found!"
                }));
            }

            const likeIndex = post.likes.indexOf(userId);
            if (likeIndex === -1) {
                post.likes.push(userId);
            } else {
                post.likes.splice(likeIndex, 1);
            }

            await post.save();
            res.status(HttpCode.OK).json(post);
        } catch (error) {
            return next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error updating likes!"
            }));
        }
    };

    public addComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { postId } = req.params;
            const { userId, content } = req.body;

            const post = await PostModel.findById(postId);
            if (!post) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Post not found!"
                }));
            }

            const comment = {
                user_id: userId,
                content,
                _id: new Types.ObjectId(),
                createdAt: new Date(),
                updatedAt: new Date()
            };

            post.comments.push(comment);
            await post.save();

            const populatedPost = await PostModel.populate(post, {
                path: 'comments.user_id',
                select: 'username profile_picture'
            });

            res.status(HttpCode.OK).json(populatedPost);
        } catch (error) {
            return next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error adding comment!"
            }));
        }
    };

    public editComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { postId, commentId } = req.params;
            const { content } = req.body;
            const userId = req.body.user?.id;

            const post = await PostModel.findById(postId);
            if (!post) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Post not found!"
                }));
            }

            const comment = post.comments.id(commentId);
            if (!comment) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Comment not found!"
                }));
            }

            if (comment.user_id.toString() !== userId.toString()) {
                return next(new AppError({
                    httpCode: HttpCode.UNAUTHORIZED,
                    description: "You can only edit your own comments!"
                }));
            }

            comment.content = content;
            comment.updatedAt = new Date();
            await post.save();

            const populatedPost = await PostModel.populate(post, {
                path: 'comments.user_id',
                select: 'username profile_picture'
            });

            res.status(HttpCode.OK).json(populatedPost);
        } catch (error) {
            next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error editing comment!"
            }));
        }
    };

    public deleteComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { postId, commentId } = req.params;
            const userId = req.body.user?.id;

            const post = await PostModel.findById(postId);
            if (!post) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Post not found!"
                }));
            }

            const comment = post.comments.id(commentId);
            if (!comment) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Comment not found!"
                }));
            }

            if (comment.user_id.toString() !== userId.toString()) {
                return next(new AppError({
                    httpCode: HttpCode.UNAUTHORIZED,
                    description: "You can only delete your own comments!"
                }));
            }

            post.comments.pull(commentId);
            await post.save();

            res.status(HttpCode.OK).json({
                message: "Comment deleted successfully!",
                postId,
                commentId
            });
        } catch (error) {
            next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error deleting comment!"
            }));
        }
    };
};

export const postsController = new PostController();