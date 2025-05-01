import { useParams } from 'react-router';
import { useGetChatsQuery } from '../../redux/chats/chatsApi';
import ChatComponent from './ChatComponent';
import SearchForm from './SearchForm';
import { IChat } from '../../redux/types/chats';
import { useState } from 'react';
import ChatWindow from './ChatWindow';
import styles from '../../styles/components/chats/ChatsPage.module.scss'

const ChatsPage = () => {
    const { userId } = useParams<{ userId: string }>();
    const { data: chats, isLoading, isError } = useGetChatsQuery(userId as string, {
        pollingInterval: 1000,
        refetchOnFocus: true,
        refetchOnReconnect: true
    });
    const [selectedChat, setSelectedChat] = useState<string | null>();

    if (isLoading || isError) return;

    return (
        <div className={styles.chatsPage}>
            <div className={styles.chatComponents}>
                <SearchForm shouldCreateChat={true} />
                {chats && chats.map((chat: IChat) => (
                    <div key={chat._id} onClick={() => setSelectedChat(chat._id)} style={{ width: '100%' }}>
                        <ChatComponent chat={chat} />
                    </div>
                ))}
            </div>

            <div className={styles.chatWindowContainer}>
                {selectedChat ? (
                    <ChatWindow chatId={selectedChat} userId={userId as string} />
                ) : (
                    <div className={styles.noChatSelected}>
                        <h3>Select a chat to start messaging</h3>
                        <p>Choose a conversation from the list to view messages</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChatsPage;