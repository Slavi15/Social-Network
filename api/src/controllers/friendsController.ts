import { Request, Response, NextFunction } from "express";
import { FriendRequestModel, FriendRequestStatus } from "@/models/friends";
import { UserModel } from "@/models/users.ts";
import { AppError, HttpCode } from "@/exceptions/AppError.ts";

class FriendRequestController {

    public getPendingRequests = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = req.params;

            if (!userId) {
                throw new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "User ID is required"
                });
            }

            const pendings = await FriendRequestModel.find({
                status: FriendRequestStatus.PENDING,
                receiver: userId
            })
                .populate('sender', 'username profile_picture')
                .populate('receiver', 'username profile_picture')
                .sort({ createdAt: -1 });

            res.status(HttpCode.OK).json(pendings);
        } catch (err) {
            return next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Failed to fetch pending friend requests",
            }));
        }
    }

    public sendRequest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { sender, receiver } = req.body;

            if (sender === receiver) {
                return next(new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "You cannot send a friend request to yourself!",
                }));
            }

            const existingRequest = await FriendRequestModel.findOne({ sender, receiver });

            if (existingRequest) {
                return next(new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "Friend request already sent!",
                }));
            }

            const newRequest = await FriendRequestModel.create({ sender, receiver });
            res.status(HttpCode.CREATED).json(newRequest);
        } catch (err) {
            next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error sending friend request!",
            }));
        }
    };

    public cancelRequest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { sender, receiver } = req.body;

            if (sender === receiver) {
                return next(new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "Invalid request!",
                }));
            }

            const deletedRequest = await FriendRequestModel.findOneAndDelete({
                $or: [
                    { sender, receiver },
                    { sender: receiver, receiver: sender }
                ],
                status: FriendRequestStatus.PENDING
            });

            if (!deletedRequest) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "No pending friend request found between these users",
                }));
            }

            res.status(HttpCode.OK).json({
                message: "Friend request cancelled",
                cancelledRequest: deletedRequest
            });
        } catch (err) {
            next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error cancelling friend request!",
            }));
        }
    };

    public checkRequestStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { sender, receiver } = req.query;

            if (!sender || !receiver) {
                throw new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "Both sender and receiver IDs are required"
                });
            }

            const request = await FriendRequestModel.findOne({
                sender,
                receiver,
                status: FriendRequestStatus.PENDING
            });

            res.status(HttpCode.OK).json(request || null);
        } catch (err) {
            next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error checking friend request status",
            }));
        }
    };

    public unfriend = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId, friendId } = req.body;

            if (!userId || !friendId) {
                throw new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "Both user ID and friend ID are required"
                });
            }

            if (userId === friendId) {
                throw new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "Cannot unfriend yourself"
                });
            }

            const [user, friend] = await Promise.all([
                UserModel.findByIdAndUpdate(
                    userId,
                    { $pull: { friends: friendId } },
                    { new: true }
                ),
                UserModel.findByIdAndUpdate(
                    friendId,
                    { $pull: { friends: userId } },
                    { new: true }
                )
            ]);

            if (!user || !friend) {
                throw new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "One or both users not found"
                });
            }

            res.status(HttpCode.OK).json({
                message: "Successfully unfriended",
                user: user._id,
                friend: friend._id
            });
        } catch (err) {
            next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error unfriending user",
            }));
        }
    };

    public acceptRequest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { request_id } = req.params;

            const request = await FriendRequestModel.findById(request_id);

            if (!request) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Friend request not found!",
                }));
            }

            if (request.status !== "PENDING") {
                return next(new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "Friend request already processed!",
                }));
            }

            await UserModel.findByIdAndUpdate(request.sender, { $addToSet: { friends: request.receiver } });
            await UserModel.findByIdAndUpdate(request.receiver, { $addToSet: { friends: request.sender } });

            await FriendRequestModel.findByIdAndDelete(request_id);

            res.status(HttpCode.OK).json({ message: "Friend request accepted!" });
        } catch (err) {
            next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error accepting friend request!",
            }));
        }
    };

    public rejectRequest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { request_id } = req.params;

            const request = await FriendRequestModel.findById(request_id);

            if (!request) {
                return next(new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Friend request not found!",
                }));
            }

            if (request.status !== "PENDING") {
                return next(new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "Friend request already processed!",
                }));
            }

            await FriendRequestModel.findByIdAndDelete(request_id);

            res.status(HttpCode.OK).json({ message: "Friend request rejected!" });
        } catch (err) {
            next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error rejecting friend request!",
            }));
        }
    };

}

export const friendRequestController = new FriendRequestController();