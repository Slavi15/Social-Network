import { Server } from "socket.io";
import { Types } from "mongoose";
import { SocketEvent } from "@/types/sockets";
import { AppError, HttpCode } from "@/exceptions/AppError";
import { ISendMessageData } from "@/types/chats";
import { ChatHandler } from "./chatHandler";
import env from "@/lib/env";

export class SocketService extends ChatHandler {
    private io: Server;

    constructor(server: any) {
        super();
        this.io = new Server(server, {
            cors: {
                origin: env.ORIGIN,
                methods: ["GET", "POST"]
            }
        });
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
                    this.notifyParticipants(chat, message, senderId, { tempId, io: this.io });
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

}