import { useAuth } from '../../redux/auth/authHooks';
import Friend from './Friend';
import { useGetPendingQuery } from '../../redux/friends/friendsApi';
import { useGetMutualFriendsQuery } from '../../redux/users/usersApi';
import styles from '../../styles/components/friends/Friends.module.scss'

const FriendsPage = () => {
    const { user } = useAuth();
    const pendingRequests = (userId: string) => useGetPendingQuery(userId as string);
    const mutualFriends = (userId: string) => useGetMutualFriendsQuery(userId as string);

    return (
        <div className={styles.friendPage}>
            <h1 className={styles.friendSection}>Pending</h1>
            <Friend
                getData={pendingRequests}
                isPending={true}
                userId={user?._id as string} />

            <h1 className={styles.friendSection}>People you might know</h1>
            <Friend
                getData={mutualFriends}
                isPending={false}
                userId={user?._id as string} />
        </div>
    )
}

export default FriendsPage;