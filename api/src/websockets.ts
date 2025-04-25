import { Server } from "socket.io";
import { ChatService } from "@/services/chatService";
import { SocketEvent } from "@/types/sockets";
import { ISendMessageData } from "@/types/chats";

export function initializeSocket(io: Server, chatService: ChatService) {
    io.on(SocketEvent.CONNECTION, (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on(SocketEvent.SEND_MESSAGE, async (data: ISendMessageData) => {
            try {
                const { chatId, senderId, content } = data;
                const { chat, message } = await chatService.handleSendMessage(chatId, senderId, content);
                chatService.notifyParticipants(chat, message, senderId);
            } catch (err) {
                console.error("Error sending message:", err);
                socket.emit(SocketEvent.MESSAGE_ERROR, {
                    error: err instanceof Error ? err.message : "Failed to send message",
                    chatId: data.chatId
                });
            }
        });

        socket.on(SocketEvent.DISCONNECT, () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
}