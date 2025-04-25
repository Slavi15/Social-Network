import { Server } from "socket.io";
import { ChatModel } from "@/models/chats";
import { AppError, HttpCode } from "@/exceptions/AppError";
import { Types } from "mongoose";
import { SocketEvent } from "@/types/sockets";

export class ChatService {
    private connectedUsers = new Map<string, string>();

    constructor(private io: Server) {
        this.setupConnectionTracking();
    }

    private setupConnectionTracking() {
        this.io.on(SocketEvent.CONNECTION, (socket) => {
            const userId = socket.handshake.auth.userId;
            if (userId && Types.ObjectId.isValid(userId)) {
                this.connectedUsers.set(userId, socket.id);

                socket.on(SocketEvent.DISCONNECT, () => {
                    this.connectedUsers.delete(userId);
                });
            }
        });
    }

    public async handleSendMessage(chatId: string, userId: string, content: string) {
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

    public notifyParticipants(chat: any, message: any, senderId: string) {
        chat.participants.forEach((participant: any) => {
            const participantId = participant._id.toString();
            const participantSocketId = this.connectedUsers.get(participantId);

            if (participantSocketId && participantId !== senderId) {
                this.io.to(participantSocketId).emit(SocketEvent.NEW_MESSAGE, {
                    chatId: chat._id,
                    message: {
                        ...message.toObject(),
                        sender: message.sender.toObject?.() || message.sender
                    }
                });
            }
        });
    }
}