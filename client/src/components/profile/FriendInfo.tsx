import ProfilePicture, { ImageSize } from "./ProfilePicture";
import styles from '../../styles/components/friends/Friends.module.scss'
import { IUser } from "../../redux/types/users";
import { useAuth } from "../../redux/auth/authHooks";
import { useCreateChatMutation } from "../../redux/chats/chatsApi";

interface FriendInfoProps {
    friend: IUser;
    showFriends: boolean;
    shouldCreateChat: boolean;
}

const FriendInfo: React.FC<FriendInfoProps> = ({
    friend,
    showFriends,
    shouldCreateChat
}) => {
    const { user } = useAuth();
    const [createChat] = useCreateChatMutation();

    const handleCreateChat = async () => {
        if (!shouldCreateChat) return;

        try {
            await createChat({
                userId: user?._id as string,
                participantId: friend._id as string
            }).unwrap();
        } catch (error) {
            console.error('Failed to create chat:', error);
        }
    }

    return (
        <div className={styles.friendInfo} onClick={handleCreateChat}>
            <ProfilePicture
                userId={friend?._id as string}
                username={friend?.username as string}
                profilePicture={friend?.profile_picture as string}
                size={ImageSize.SMALL}
                linkToProfile={true} />

            <h3 className={styles.friendUsername}>{friend?.username as string}</h3>

            {showFriends && (
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Friends</span>
                    <span className={styles.statNumber}>{friend?.friends.length || 0}</span>
                </div>
            )}
        </div>
    )
}

export default FriendInfo;