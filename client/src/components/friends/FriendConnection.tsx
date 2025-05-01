import { useGetUserQuery } from "../../redux/users/usersApi";
import { IConnection } from "../../redux/types/users";
import ProfilePicture, { ImageSize } from "../profile/ProfilePicture";
import { useSendRequestMutation } from "../../redux/friends/friendsApi";
import { useAuth } from "../../redux/auth/authHooks";
import styles from '../../styles/components/friends/Friends.module.scss';
import ConnectionsModal from "./ConnectionsModal";

interface FriendConnectionProps {
    connection: IConnection;
}

const FriendConnection: React.FC<FriendConnectionProps> = ({
    connection,
}) => {
    const { user: currentUser } = useAuth();
    const { data: user, isLoading } = useGetUserQuery(connection.userId as string, {
        pollingInterval: 1000,
        refetchOnFocus: true,
        refetchOnReconnect: true,
        refetchOnMountOrArgChange: true
    });
    const [sendRequest] = useSendRequestMutation();

    const handleAddFriend = async () => {
        if (!currentUser || !user) return;

        try {
            await sendRequest({
                sender: currentUser._id as string,
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
                userId={user._id as string}
                username={user.username}
                profilePicture={user.profile_picture as string}
                size={ImageSize.MEDIUM}
                linkToProfile={true} />

            <ConnectionsModal user={user} connection={connection} />

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
