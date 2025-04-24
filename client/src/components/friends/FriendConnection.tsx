import { useGetUserQuery } from "../../redux/users/usersApi";
import styles from '../../styles/components/friends/Friends.module.scss';
import { IConnection } from "../../redux/types/users";
import ProfilePicture, { ImageSize } from "../profile/ProfilePicture";

interface FriendConnectionProps {
    connection: IConnection;
}

const FriendConnection = ({ connection }: FriendConnectionProps) => {
    const { data: user, isLoading } = useGetUserQuery(connection.userId);

    if (isLoading) return <div className={styles.loading}>Loading user...</div>;
    if (!user) return null;

    return (
        <div className={styles.connection}>
            <div className={styles.connectionInfo}>
                <ProfilePicture
                    userId={user.id as string}
                    username={user.username}
                    profilePicture={user.profile_picture as string}
                    size={ImageSize.MEDIUM}
                    linkToProfile={true} />
                <div>
                    <h3>{user.username}</h3>
                    <p>Mutual Friends {connection.mutualCount} </p>
                </div>
            </div>
            <button className={styles.addButton}>
                Add Friend
            </button>
        </div>
    );
};

export default FriendConnection;
