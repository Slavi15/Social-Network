import { Server } from "socket.io";
import { createServer } from "http";
import { MessageModel } from "@/models/messages.ts";
import env from "@/lib/env.ts";

const httpServer = createServer();

const io = new Server(httpServer, {
    cors: {
        origin: env.ORIGIN,
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("sendMessage", async (data) => {
        const { senderId, receiverId, content } = data;

        try {
            const newMessage = await MessageModel.create({
                sender: senderId,
                receiver: receiverId,
                content,
            });

            socket.to(receiverId).emit("receiveMessage", {
                senderId,
                content,
                timestamp: newMessage.createdAt,
            });
        } catch (err) {
            console.error("Error sending message:", err);
        }
    });

    socket.on("joinRoom", (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room ${userId}`);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

const WS_PORT = env.WS_PORT || 7001;

httpServer.listen(WS_PORT, () => {
    console.log(`WebSocket server running on port: ${WS_PORT}`);
});

export { io };