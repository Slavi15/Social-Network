import { Types } from "mongoose";
import { Request, Response, NextFunction } from "express";
import { UserModel } from "@/models/users.ts";
import { validateUser } from "@/validators/usersValidator.ts";
import { AppError, HttpCode } from "@/exceptions/AppError.ts";

class UserController {

    public getUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await UserModel.find()
                .populate("friends", "-password -email -__v")
                .populate("chats");

            res.status(HttpCode.OK).json(users);
        } catch (err) {
            return next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Could not fetch users!"
            }));
        };
    };

    public getUsersByName = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username } = req.params;

            if (!username || username === '') {
                return next(new AppError({
                    httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                    description: "Invalid username!"
                }));
            }

            const users = await UserModel.find({
                username: username
            })
                .select("-password -email -__v")
                .populate("friends", "-password -email -__v")

            res.status(HttpCode.OK).json(users);
        } catch (err) {
            return next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Invalid username!"
            }));
        }
    }

    public getUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { user_id } = req.params;
            const user = await UserModel.findById(user_id)
                .select("-password -email -__v")
                .populate("friends", "-password -email -__v")
                .populate("chats");

            if (!user) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "User not found!"
                }));
            };

            res.status(HttpCode.OK).json(user);
        } catch (err) {
            return next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Invalid user ID!"
            }));
        };
    };

    public getMutualFriends = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = req.params;

            if (!userId || !Types.ObjectId.isValid(userId)) {
                return next(new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "Invalid user ID provided!"
                }));
            }

            const currentUser = await UserModel.findById(userId).select('friends');
            if (!currentUser) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Current user not found!"
                }));
            }

            const potentialConnections = await UserModel.find({
                _id: {
                    $ne: userId,
                    $nin: currentUser.friends
                }
            }).select('username profile_picture friends');

            const currentUserFriendIds = new Set(currentUser.friends.map(id => id.toString()));

            const results = await Promise.all(
                potentialConnections.map(async (user) => {
                    const userFriendIds = new Set(user.friends.map(id => id.toString()));
                    const mutualCount = [...currentUserFriendIds].filter(id => userFriendIds.has(id)).length;

                    if (mutualCount > 0) {
                        return {
                            userId: user._id,
                            username: user.username,
                            profile_picture: user.profile_picture,
                            friends: user.friends,
                            mutualCount
                        };
                    }

                    return null;
                })
            );

            const connections = results.filter(Boolean);
            res.status(HttpCode.OK).json(connections);
        } catch (err) {
            return next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Could not fetch mutual friends!"
            }));
        }
    };

    public updateUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { user_id } = req.params;
            const err = validateUser(req.body);

            if (err) {
                return next(new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "Invalid user provided!",
                }));
            };

            const updatedUser = await UserModel.findByIdAndUpdate(user_id, req.body, { new: true });

            if (!updatedUser) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "User not found!",
                }));
            };

            res.status(HttpCode.OK).json(updatedUser);
        } catch (err) {
            return next(new AppError({
                httpCode: HttpCode.BAD_REQUEST,
                description: "Invalid user ID!",
            }));
        };
    };

    public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { user_id } = req.params;
            const deletedUser = await UserModel.findByIdAndDelete(user_id);

            if (!deletedUser) {
                throw new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "User not found!",
                });
            };

            res.status(HttpCode.OK).json({ message: "User deleted successfully!" });
        } catch (err) {
            next(new AppError({
                httpCode: HttpCode.BAD_REQUEST,
                description: "Invalid user ID!",
            }));
        };
    };

};

export const usersController = new UserController();