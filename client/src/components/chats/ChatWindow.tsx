import { useEffect, useRef } from "react";
import { getSocket } from "../../lib/socket";
import { useGetChatQuery, useGetMessagesQuery } from "../../redux/chats/chatsApi";
import styles from '../../styles/components/chats/ChatsPage.module.scss'
import { SocketEvent } from "../../redux/types/sockets";
import { IMessage } from "../../redux/types/chats";
import MessageForm from "./MessageForm";
import MessageComponent from "./MessageComponent";

interface ChatWindowProps {
    chatId: string;
    userId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
    chatId,
    userId
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const socket = getSocket();

    const { data: chat } = useGetChatQuery({ 
        chatId: chatId, 
        userId: userId 
    }, {
        pollingInterval: 1000,
        refetchOnFocus: true,
        refetchOnReconnect: true,
        refetchOnMountOrArgChange: true
    });
    const { data: messages, isLoading, isError, refetch } = useGetMessagesQuery({ 
        chatId: chatId, 
        userId: userId 
    }, {
        pollingInterval: 1000,
        refetchOnFocus: true,
        refetchOnReconnect: true,
        refetchOnMountOrArgChange: true
    });

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (!chatId) return;

        const handleNewMessage = (newMessage: IMessage) => {
            if (chat?.lastMessage?._id !== newMessage._id) {
                refetch();
            }
        };

        socket.on(SocketEvent.NEW_MESSAGE, handleNewMessage);

        return () => {
            socket.off(SocketEvent.NEW_MESSAGE, handleNewMessage);
        };
    }, [chatId, refetch, socket]);

    if (isLoading || isError) return;

    return (
        <div className={styles.chatWindow}>
            <div className={styles.messagesContainer}>
                {messages && messages?.length !== 0 ?
                    messages?.map((msg: IMessage) => (
                        <MessageComponent key={msg._id as string} msg={msg} />
                    )) : "No messages!"}
                <div ref={messagesEndRef} />
            </div>

            <MessageForm chatId={chatId} userId={userId} />
        </div>
    )
}

export default ChatWindow;