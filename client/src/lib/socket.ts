import { io, Socket } from 'socket.io-client';

let socket: Socket;

export const getSocket = () => {
    if (!socket) {
        socket = io(import.meta.env.VITE_API_BASE_URL, {
            withCredentials: true,
            autoConnect: false,
        });
    }
    return socket;
};

export const connectSocket = (userId: string) => {
    const socket = getSocket();
    if (!socket.connected) {
        socket.auth = { userId };
        socket.connect();
    }
};

export const disconnectSocket = () => {
    const socket = getSocket();
    if (socket.connected) {
        socket.disconnect();
    }
};