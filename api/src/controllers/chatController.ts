import { Request, Response, NextFunction } from "express";
import { MessageModel } from "@/models/messages.ts";
import { AppError, HttpCode } from "@/exceptions/AppError.ts";

class ChatController {

    public sendMessage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { sender, receiver, content } = req.body;

            if (!content || content.trim().length === 0) {
                return next(new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "Message content is required!",
                }));
            }

            const newMessage = await MessageModel.create({ sender, receiver, content });
            res.status(201).json(newMessage);
        } catch (err) {
            next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error sending message!",
            }));
        }
    };

    public getMessages = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { user1, user2 } = req.params;

            const messages = await MessageModel.find({
                $or: [
                    { sender: user1, receiver: user2 },
                    { sender: user2, receiver: user1 },
                ],
            }).sort({ createdAt: 1 });

            res.status(200).json(messages);
        } catch (err) {
            next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Error fetching messages!",
            }));
        }
    };
    
}

export const chatController = new ChatController();