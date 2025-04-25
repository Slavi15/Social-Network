import { Types } from "mongoose";
import { Server } from "socket.io";
import { ChatModel } from "@/models/chats";
import { AppError, HttpCode } from "@/exceptions/AppError";
import { SocketEvent } from "@/types/sockets";

export abstract class ChatHandler {

    protected connectedUsers = new Map<string, string>();

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

    protected notifyParticipants(chat: any, message: any, senderId: string, options: { tempId?: string; io?: Server }) {
        chat.participants.forEach((participant: any) => {
            const participantId = participant._id.toString();
            const participantSocketId = this.connectedUsers.get(participantId);

            if (participantSocketId && options.io) {
                const eventData = {
                    chatId: chat._id,
                    message: {
                        ...message.toObject(),
                        sender: message.sender.toObject?.() || message.sender
                    },
                    chatUpdate: {
                        lastMessage: chat.lastMessage,
                        updatedAt: chat.updatedAt
                    }
                };

                if (participantId === senderId) {
                    options.io.to(participantSocketId).emit(SocketEvent.MESSAGE_SENT, {
                        ...eventData,
                        tempId: options.tempId
                    });
                } else {
                    options.io.to(participantSocketId).emit(SocketEvent.NEW_MESSAGE, eventData);
                }
            }
        });
    }
}