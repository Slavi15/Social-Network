import { Request, Response, NextFunction } from "express";
import { FriendRequestModel, FriendRequestStatus } from "@/models/friendRequests.ts";
import { UserModel } from "@/models/users.ts";
import { AppError, HttpCode } from "@/exceptions/AppError.ts";

class FriendRequestController {

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
            res.status(201).json(newRequest);
        } catch (err) {
            next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error sending friend request!",
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

            if (request.status !== "pending") {
                return next(new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "Friend request already processed!",
                }));
            }

            request.status = FriendRequestStatus.ACCEPTED;
            await request.save();

            await UserModel.findByIdAndUpdate(request.sender, { $addToSet: { friends: request.receiver } });
            await UserModel.findByIdAndUpdate(request.receiver, { $addToSet: { friends: request.sender } });

            res.status(200).json({ message: "Friend request accepted!" });
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

            if (request.status !== "pending") {
                return next(new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "Friend request already processed!",
                }));
            }

            request.status = FriendRequestStatus.REJECTED;
            await request.save();

            res.status(200).json({ message: "Friend request rejected!" });
        } catch (err) {
            next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error rejecting friend request!",
            }));
        }
    };

}

export const friendRequestController = new FriendRequestController();