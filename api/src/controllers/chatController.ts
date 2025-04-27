import { Types } from "mongoose";
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

            if (!Types.ObjectId.isValid(userId)) {
                throw new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "Invalid user ID"
                });
            }

            const user = await UserModel.findById(userId)
                .populate({
                    path: 'chats',
                    populate: [
                        {
                            path: 'participants',
                            select: 'username profile_picture is_active'
                        },
                        {
                            path: 'lastMessage.sender',
                            select: 'username profile_picture'
                        }
                    ]
                });

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

            if (!Types.ObjectId.isValid(chatId) || !Types.ObjectId.isValid(userId)) {
                throw new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "Invalid chat or user ID"
                });
            }

            const chat = await ChatModel.findOne({
                _id: chatId,
                participants: userId
            })
                .populate({
                    path: 'participants',
                    select: 'username profile_picture is_active'
                })
                .populate({
                    path: 'lastMessage.sender',
                    select: 'username profile_picture'
                });

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

            if (!Types.ObjectId.isValid(chatId) || !Types.ObjectId.isValid(userId)) {
                throw new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "Invalid chat or user ID"
                });
            }

            const chat = await ChatModel.findOne({
                _id: chatId,
                participants: userId
            })
                .populate({
                    path: 'messages.sender',
                    select: 'username profile_picture'
                })
                .select('messages');

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

            if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(participantId)) {
                throw new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "Invalid user ID(s)"
                });
            }

            if (userId === participantId) {
                throw new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "Cannot create chat with yourself"
                });
            }

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
                participants: {
                    $all: [userId, participantId],
                    $size: 2
                }
            });

            if (!chat) {
                try {
                    chat = await ChatModel.create({
                        participants: [userId, participantId],
                        messages: [],
                        lastMessage: null
                    });

                    await UserModel.updateMany(
                        { _id: { $in: [userId, participantId] } },
                        { $addToSet: { chats: chat._id } }
                    );
                } catch (createError) {
                    console.error("Create error:", createError);
                    throw createError;
                }
            }

            const populatedChat = await ChatModel.findById(chat._id)
                .populate({
                    path: 'participants',
                    select: 'username profile_picture is_active'
                });

            res.status(HttpCode.CREATED).json(populatedChat);
        } catch (err) {
            next(err);
        }
    }

    public async sendMessage(req: Request, res: Response, next: NextFunction) {
        try {
            const { chatId, userId } = req.params;
            const { content } = req.body;

            if (!Types.ObjectId.isValid(chatId) || !Types.ObjectId.isValid(userId)) {
                throw new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "Invalid chat or user ID"
                });
            }

            if (!content || typeof content !== 'string' || content.trim().length === 0) {
                throw new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "Message content cannot be empty"
                });
            }

            const { message } = await this.chatService.handleSendMessage(chatId, userId, content);

            const populatedMessage = await MessageModel.populate(message, {
                path: 'sender',
                select: 'username profile_picture'
            });

            res.status(HttpCode.CREATED).json(populatedMessage);
        } catch (err) {
            next(err);
        }
    }
}