import { Server } from "socket.io";
import { Types } from "mongoose";
import { SocketEvent } from "@/types/sockets";
import env from "@/lib/env";
import { ChatModel } from "@/models/chats";
import { AppError, HttpCode } from "@/exceptions/AppError";
import { ISendMessageData } from "@/types/chats";

export class SocketService {
    private io: Server;
    private connectedUsers: Map<string, string>

    constructor(server: any) {
        this.io = new Server(server, {
            cors: {
                origin: env.ORIGIN,
                methods: ["GET", "POST"]
            }
        });
        this.connectedUsers = new Map<string, string>();
        this.initSocket();
    }

    private initSocket() {
        this.io.on(SocketEvent.CONNECTION, socket => {
            console.log(`User connected: ${socket.id}`);

            const userId = socket.handshake.query.userId as string;
            if (userId && Types.ObjectId.isValid(userId)) {
                this.connectedUsers.set(userId, socket.id);
            }

            socket.on(SocketEvent.SEND_MESSAGE, async (data: ISendMessageData) => {
                try {
                    const { chatId, senderId, content, tempId } = data;
                    const { chat, message } = await this.handleSendMessage(chatId, senderId, content);
                    this.notifyParticipants(chat, message, senderId, tempId);
                } catch (err) {
                    console.error("Error sending message:", err);

                    socket.emit(SocketEvent.MESSAGE_ERROR, {
                        error: err instanceof AppError ? err.message : "Failed to send message",
                        tempId: data.tempId,
                        chatId: data.chatId
                    });
                }
            });

            socket.on(SocketEvent.DISCONNECT, () => {
                if (userId) {
                    this.connectedUsers.delete(userId);
                }
            });
        })
    }

    public handleSendMessage = async (chatId: string, userId: string, content: string) => {
        const chat = await ChatModel.findOne({
            _id: chatId,
            participants: userId
        });

        if (!chat) {
            throw new AppError({
                httpCode: HttpCode.NOT_FOUND,
                description: "Chat not found or access denied"
            });
        }

        const newMessage = {
            sender: userId,
            content,
            seen: [userId]
        };

        const updatedChat = await ChatModel.findByIdAndUpdate(
            chatId,
            {
                $push: { messages: newMessage },
                $set: { lastMessage: newMessage }
            },
            { new: true }
        )
            .populate("participants", "username profile_picture")
            .populate("lastMessage.sender", "username profile_picture");

        if (!updatedChat) {
            throw new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Failed to update chat"
            });
        }

        return {
            chat: updatedChat,
            message: updatedChat.lastMessage
        };
    }

    private notifyParticipants = (chat: any, message: any, senderId: string, tempId?: string) => {
        chat.participants.forEach((participant: any) => {
            const participantId = participant._id.toString();
            const participantSocketId = this.connectedUsers.get(participantId);

            if (participantSocketId) {
                const eventData = {
                    chatId: chat._id,
                    message: {
                        ...message.toObject(),
                        sender: message.sender.toObject ? message.sender.toObject() : message.sender
                    },
                    chatUpdate: {
                        lastMessage: chat.lastMessage,
                        updatedAt: chat.updatedAt
                    }
                };

                if (participantId === senderId) {
                    this.io.to(participantSocketId).emit(SocketEvent.MESSAGE_SENT, {
                        ...eventData,
                        tempId
                    });
                } else {
                    this.io.to(participantSocketId).emit(SocketEvent.NEW_MESSAGE, eventData);
                }
            }
        });
    }
}