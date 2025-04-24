import { IFriendRequest } from "../../redux/types/friendRequests";
import FriendRequest from "./FriendRequest";
import { useGetMutualFriendsQuery, useGetUserQuery } from "../../redux/users/usersApi";
import { useGetPendingQuery } from "../../redux/friends/friendsApi";
import styles from '../../styles/components/friends/Friends.module.scss'
import FriendConnection from "./FriendConnection";
import { IConnection } from "../../redux/types/users";

interface FriendProps {
    userId: string;
}

interface PendingProps extends FriendProps {
    isPending: true;
    getData: (userId: string) => ReturnType<typeof useGetPendingQuery>
}

interface MutualProps extends FriendProps {
    isPending: false;
    getData: (userId: string) => ReturnType<typeof useGetMutualFriendsQuery>
}

type FriendComponentProps = PendingProps | MutualProps;

const Friend = ({ userId, isPending, getData }: FriendComponentProps) => {
    const { data, isLoading, error } = getData(userId);

    if (isLoading) return <div className={styles.loading}>Loading...</div>;
    if (error) return <div className={styles.error}>Error loading!</div>;

    if (!data || data.length === 0) {
        return <div className={styles.empty}>
            {isPending ? 'No pending requests!' : 'No mutual connections found!'}
        </div>;
    }

    return (
        <div>
            {isPending ?
                data.map((request: IFriendRequest) => (
                    <FriendRequest
                        key={request._id as string}
                        request={request}
                        getUser={(senderId: string) => useGetUserQuery(senderId as string)} />
                )) : 
                data.map((connection: IConnection) => (
                    <FriendConnection
                        key={connection.userId as string}
                        connection={connection} />
                ))
            }
        </div>
    )
}

export default Friend;