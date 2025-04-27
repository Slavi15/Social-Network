import { useParams } from 'react-router';
import styles from '../../styles/components/chats/ChatsPage.module.scss'
import { useGetChatsQuery } from '../../redux/chats/chatsApi';
import ChatComponent from './ChatComponent';
import SearchForm from './SearchForm';
import { IChat } from '../../redux/types/chats';

const ChatsPage = () => {
    const { userId } = useParams<{ userId: string }>();
    const { data: chats, isLoading, isError } = useGetChatsQuery(userId as string);

    if (isLoading || isError) return;

    return (
        <div className={styles.chatsPage}>
            <div className={styles.chatComponents}>
                <SearchForm />
                {chats && chats.map((chat: IChat) => (
                    <ChatComponent key={chat._id} chat={chat} />
                ))}
            </div>
        </div>
    )
}

export default ChatsPage;