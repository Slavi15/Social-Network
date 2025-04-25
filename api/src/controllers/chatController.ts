import { Request, Response, NextFunction } from "express";
import { ChatModel, MessageModel } from "@/models/chats";
import { AppError, HttpCode } from "@/exceptions/AppError";
import { UserModel } from "@/models/users";
import { ChatService } from "@/services/chatService";

export class ChatController {
    constructor(private chatService: ChatService) { }

    public async getChats(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const user = await UserModel.findById(userId).select('chats');

            if (!user) {
                throw new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "User not found"
                });
            }

            res.status(HttpCode.OK).json(user.chats);
        } catch (err) {
            next(err);
        }
    }

    public async getChat(req: Request, res: Response, next: NextFunction) {
        try {
            const { chatId, userId } = req.params;
            const chat = await ChatModel.findOne({
                _id: chatId,
                participants: userId
            })
                .populate("participants", "username profile_picture")
                .populate("lastMessage.sender", "username profile_picture");

            if (!chat) {
                throw new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Chat not found or access denied"
                });
            }

            res.status(HttpCode.OK).json(chat);
        } catch (err) {
            next(err);
        }
    }

    public async getMessages(req: Request, res: Response, next: NextFunction) {
        try {
            const { chatId, userId } = req.params;
            const chat = await ChatModel.findOne({
                _id: chatId,
                participants: userId
            })
                .populate("messages.sender", "username profile_picture")
                .select("messages");

            if (!chat) {
                throw new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Chat not found or access denied"
                });
            }

            res.status(HttpCode.OK).json(chat.messages);
        } catch (err) {
            next(err);
        }
    }

    public async createChat(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, participantId } = req.params;
            const [user, participant] = await Promise.all([
                UserModel.findById(userId),
                UserModel.findById(participantId)
            ]);

            if (!user || !participant) {
                throw new AppError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "One or both users not found"
                });
            }

            let chat = await ChatModel.findOne({
                participants: { $all: [userId, participantId], $size: 2 }
            });

            if (!chat) {
                chat = await ChatModel.create({
                    participants: [userId, participantId]
                });

                await UserModel.updateMany(
                    { _id: { $in: [userId, participantId] } },
                    { $addToSet: { chats: chat._id } }
                );
            }

            res.status(HttpCode.OK).json({ chatId: chat._id });
        } catch (err) {
            next(err);
        }
    }

    public async sendMessage(req: Request, res: Response, next: NextFunction) {
        try {
            const { chatId, userId } = req.params;
            const { content } = req.body;

            const { message } = await this.chatService.handleSendMessage(chatId, userId, content);
            res.status(HttpCode.CREATED).json(message);
        } catch (err) {
            next(err);
        }
    }
}