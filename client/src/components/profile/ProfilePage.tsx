import { useParams } from 'react-router-dom';
import { useAuth } from "../../redux/auth/authHooks";
import { useGetUserPostsQuery } from "../../redux/posts/postsApi";
import { useGetUserQuery } from '../../redux/users/usersApi';
import Posts from "../posts/Posts";
import Profile, { FriendStatus } from "./Profile";
import { useCancelRequestMutation, useCheckRequestStatusQuery, useSendRequestMutation, useUnfriendMutation } from '../../redux/friends/friendsApi';
import styles from '../../styles/components/profile/ProfilePage.module.scss'
import { IUser } from '../../redux/types/users';

const ProfilePage = () => {
    const { user: currentUser } = useAuth();
    const { userId } = useParams<{ userId: string }>();
    const [sendRequest] = useSendRequestMutation();
    const [cancelRequest] = useCancelRequestMutation();
    const [unfriend] = useUnfriendMutation();

    const { data: profileUser, isLoading: isUserLoading } = useGetUserQuery(userId as string);
    const userPosts = (userId: string) => useGetUserPostsQuery(userId as string);
    
    const { data: request } = useCheckRequestStatusQuery({
        sender: currentUser?._id as string,
        receiver: userId as string
    });

    const handleSendRequest = async () => {
        if (!currentUser || !userId) return;

        try {
            await sendRequest({
                sender: currentUser._id,
                receiver: userId
            }).unwrap();
        } catch (error) {
            console.error('Friend request error:', error);
        }
    };

    const handleCancelRequest = async () => {
        if (!currentUser || !userId) return;

        try {
            await cancelRequest({
                sender: currentUser._id,
                receiver: userId
            }).unwrap();
        } catch (err) {
            console.error("Error cancelling request:", err);
        }
    }

    const handleUnfriendRequest = async () => {
        if (!currentUser || !userId) return;

        try {
            await unfriend({
                userId: currentUser._id,
                friendId: userId
            }).unwrap();
        } catch (err) {
            console.error("Error unfriending:", err);
        }
    }

    if (isUserLoading) return <div className={styles.loading}>Loading profile...</div>;
    if (!profileUser) return <div className={styles.error}>User not found</div>;

    const isCurrentUser: boolean = currentUser?._id === userId;
    const isFriend: boolean = !!currentUser?.friends?.find((friend: IUser) => friend._id === userId);
    const isPending: boolean = request?.status as string === "PENDING";

    return (
        <div className={styles.profilePage}>
            <Profile
                user={{
                    _id: userId as string,
                    username: profileUser.username,
                    email: profileUser.email,
                    profile_picture: profileUser.profile_picture,
                    friends: profileUser.friends
                }}
                onFriend={
                    !isCurrentUser && !isFriend && !isPending ? handleSendRequest : 
                        isFriend ? handleUnfriendRequest :
                            isPending ? handleCancelRequest : undefined
                }
                isCurrentUser={isCurrentUser}
                friendStatus={
                    isCurrentUser && !isFriend && !isPending ? undefined :
                        isFriend ? FriendStatus.FRIENDS :
                            isPending ? FriendStatus.PENDING : FriendStatus.NONE
                }
            />
            <Posts
                getPosts={userPosts}
                userId={userId as string}
            />
        </div>
    )
}

export default ProfilePage;