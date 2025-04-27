import { useAuth } from '../../redux/auth/authHooks';
import { IChat } from '../../redux/types/chats';
import { useGetUserQuery } from '../../redux/users/usersApi';
import ProfilePicture, { ImageSize } from '../profile/ProfilePicture';
import styles from '../../styles/components/chats/ChatsPage.module.scss'

interface ChatComponentProps {
    chat: IChat;
}

const ChatComponent: React.FC<ChatComponentProps> = ({
    chat
}) => {
    const { user } = useAuth();
    const otherId = chat.participants.find(userId => userId !== user?._id as string);
    const { data: otherUser } = useGetUserQuery(otherId as string);

    return (
        <div className={styles.chatComponent}>
            <ProfilePicture
                userId={otherUser?._id as string}
                username={otherUser?.username as string}
                profilePicture={otherUser?.profile_picture as string}
                size={ImageSize.SMALL}
                linkToProfile={true} />

            <h4 className={styles.chatUsername}>{otherUser?.username}</h4>
        </div>
    )
}

export default ChatComponent;