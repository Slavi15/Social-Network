import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from "../../redux/auth/authHooks";
import { useGetUserPostsQuery } from "../../redux/posts/postsApi";
import { useGetUserQuery } from '../../redux/users/usersApi';
import Posts from "../posts/Posts";
import Profile from "./Profile";
import styles from '../../styles/components/profile/ProfilePage.module.scss'

const ProfilePage = () => {
    const { userId } = useParams<{ userId: string }>();
    const { user: currentUser } = useAuth();
    const [effectiveUserId, setEffectiveUserId] = useState<string>('');

    useEffect(() => {
        const id = userId || currentUser?.id || '';
        setEffectiveUserId(id);
    }, [userId, currentUser?.id]);

    const { data: profileUser, isLoading: isUserLoading } = useGetUserQuery(effectiveUserId);
    const userPosts = (effectiveUserId: string) => useGetUserPostsQuery(effectiveUserId);

    const handleFriendAction = () => {

    };

    if (isUserLoading) return <div className={styles.loading}>Loading profile...</div>;
    if (!profileUser) return <div className={styles.error}>User not found</div>;

    const isCurrentUser = currentUser?.id === effectiveUserId;

    return (
        <div className={styles.profilePage}>
            <Profile
                user={{
                    _id: effectiveUserId,
                    username: profileUser.username,
                    email: profileUser.email,
                    profile_picture: profileUser.profile_picture,
                    friends: profileUser.friends
                }}
                onFriend={!isCurrentUser ? handleFriendAction : undefined}
                isCurrentUser={isCurrentUser}
            />
            <Posts
                getPosts={userPosts}
                userId={effectiveUserId}
            />
        </div>
    )
}

export default ProfilePage;