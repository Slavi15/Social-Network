// MessageComponent.tsx
import { IMessage } from "../../redux/types/chats";
import { useGetUserQuery } from "../../redux/users/usersApi";
import styles from '../../styles/components/chats/ChatsPage.module.scss'
import ProfilePicture, { ImageSize } from "../profile/ProfilePicture";

interface MessageProps {
    msg: IMessage;
}

const MessageComponent: React.FC<MessageProps> = ({ msg }) => {
    const { data: user, isLoading, isError } = useGetUserQuery(msg.sender._id as string);

    if (isLoading || isError) return null;

    return (
        <div className={styles.message}>
            <div className={styles.profilePicture}>
                <ProfilePicture
                    userId={user?._id as string}
                    username={user?.username as string}
                    profilePicture={user?.profile_picture as string}
                    size={ImageSize.SMALL}
                    linkToProfile={true}
                />
            </div>

            <div className={styles.messageContent}>
                <div className={styles.messageDetails}>
                    <h4 className={styles.messageSender}>{user?.username}</h4>
                    <time className={styles.timestamp}>
                        {new Date(msg.timestamp).toLocaleTimeString()}
                    </time>
                </div>

                <div className={styles.content}>
                    <p>{msg.content}</p>
                </div>
            </div>
        </div>
    )
}

export default MessageComponent;