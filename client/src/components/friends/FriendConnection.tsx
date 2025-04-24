import { useGetUserQuery } from "../../redux/users/usersApi";
import { IConnection } from "../../redux/types/users";
import ProfilePicture, { ImageSize } from "../profile/ProfilePicture";
import { useSendRequestMutation } from "../../redux/friends/friendsApi";
import { useAuth } from "../../redux/auth/authHooks";
import styles from '../../styles/components/friends/Friends.module.scss';

interface FriendConnectionProps {
    connection: IConnection;
}

const FriendConnection: React.FC<FriendConnectionProps> = ({
    connection,
}) => {
    const { user: currentUser } = useAuth();
    const { data: user, isLoading } = useGetUserQuery(connection.userId as string);
    const [sendRequest] = useSendRequestMutation();

    const handleAddFriend = async () => {
        if (!currentUser || !user) return;

        try {
            await sendRequest({
                sender: currentUser.id as string,
                receiver: user?._id as string,
            }).unwrap();
        } catch (error) {
            console.error("Failed to send friend request");
        }
    };

    if (isLoading) return <div className={styles.loading}>Loading user...</div>;
    if (!user) return null;

    return (
        <div className={styles.connection}>
            <ProfilePicture
                userId={user.id as string}
                username={user.username}
                profilePicture={user.profile_picture as string}
                size={ImageSize.MEDIUM}
                linkToProfile={true} />

            <div className={styles.connInfo}>
                <h2 className={styles.username}>{user.username}</h2>
                <p className={styles.mutualInfo}>Mutual Friends {connection.mutualCount} </p>
            </div>

            <button 
                className={styles.addButton}
                onClick={handleAddFriend}    
            >
                Add Friend
            </button>
        </div>
    );
};

export default FriendConnection;
