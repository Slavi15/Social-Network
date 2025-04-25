import { Server } from "socket.io";
import { Types } from "mongoose";
import { SocketEvent } from "@/types/sockets";
import { ChatHandler } from "./chatHandler";

export class ChatService extends ChatHandler {

    constructor(private io: Server) {
        super();
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

    public notifyParticipants(chat: any, message: any, senderId: string) {
        super.notifyParticipants(chat, message, senderId, { io: this.io });
    }
}