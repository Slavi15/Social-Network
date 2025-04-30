import { useAcceptRequestMutation, useRejectRequestMutation } from '../../redux/friends/friendsApi';
import { IFriendRequest } from '../../redux/types/friendRequests';
import { useGetUserQuery } from '../../redux/users/usersApi';
import ProfilePicture, { ImageSize } from '../profile/ProfilePicture';
import styles from '../../styles/components/friends/Friends.module.scss'

interface FriendRequestProps {
    request: IFriendRequest;
    getUser: (id: string) => ReturnType<typeof useGetUserQuery>;
}

const FriendRequest: React.FC<FriendRequestProps> = ({ 
    request, 
    getUser 
}) => {
    const { data: sender } = getUser(request.sender as string);
    const [acceptRequest] = useAcceptRequestMutation();
    const [rejectRequest] = useRejectRequestMutation();

    const handleAcceptRequest = async () => {
        try {
            await acceptRequest({ requestId: request._id }).unwrap();
        } catch (error) {
            console.error('Failed to accept request:', error);
        }
    };

    const handleRejectRequest = async () => {
        try {
            await rejectRequest({ requestId: request._id }).unwrap();
        } catch (error) {
            console.error('Failed to reject request:', error);
        }
    };

    if (!sender) return null;

    return (
        <div className={styles.friendRequest}>
            <ProfilePicture
                userId={sender._id as string}
                username={sender.username}
                profilePicture={sender.profile_picture as string}
                size={ImageSize.MEDIUM}
                linkToProfile={true} />

            <h2 className={styles.username}>{sender.username}</h2>

            <div className={styles.requestActions}>
                <button onClick={handleAcceptRequest} className={styles.acceptButton}>
                    Accept
                </button>
                <button onClick={handleRejectRequest} className={styles.rejectButton}>
                    Reject
                </button>
            </div>
        </div>
    )
}

export default FriendRequest;