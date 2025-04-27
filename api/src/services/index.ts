import { Server } from "http";
import { Server as SocketServer } from "socket.io";
import { ChatService } from "./chatService";
import { ChatController } from "@/controllers/chatController";
import env from "@/lib/env";
import { initializeSocket } from "@/websockets";

export function initializeServices(httpServer: Server) {
    try {
        console.log('Initializing Socket.IO server...');
        const io = new SocketServer(httpServer, {
            cors: {
                origin: env.ORIGIN,
                credentials: true,
                methods: ["GET", "POST", "PUT", "DELETE"],
                allowedHeaders: ["Content-Type", "Authorization"]
            },
            connectionStateRecovery: {
                maxDisconnectionDuration: 2 * 60 * 1000
            }
        });

        console.log('Socket.IO server initialized');
        const chatService = new ChatService(io);
        const chatController = new ChatController(chatService);

        initializeSocket(io, chatService);

        return {
            chatService,
            chatController
        };
    } catch (err) {
        console.error('Error initializing services:', err);
        throw err;
    }
}