import React from "react";
import styles from '../../styles/components/profile/ProfilePage.module.scss'
import ProfilePicture, { ImageSize } from "./ProfilePicture";

interface UserProfile {
    _id: string;
    username: string;
    email: string;
    profile_picture?: string;
    friends?: string[];
}

interface ProfileProps {
    user: UserProfile;
    onFriend?: () => void;
    isCurrentUser?: boolean;
}

const Profile: React.FC<ProfileProps> = ({
    user,
    onFriend,
    isCurrentUser
}) => {
    return (
        <div className={styles.profileHeader}>
            <div className={styles.avatarContainer}>
                <ProfilePicture
                    userId={user._id as string}
                    username={user.username}
                    profilePicture={user.profile_picture as string}
                    size={ImageSize.MEDIUM}
                    linkToProfile={true} />
            </div>

            <div className={styles.profileInfo}>
                <h1 className={styles.username}>{user.username}</h1>
                <p className={styles.email}>{user.email}</p>
            </div>

            <div className={styles.stats}>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Friends</span>
                    <span className={styles.statNumber}>{user.friends?.length || 0}</span>
                </div>

                {!isCurrentUser && onFriend && (
                    <button
                        onClick={onFriend}
                        className={styles.friendButton}
                    >
                        Add Friend
                    </button>
                )}
            </div>
        </div>
    )
}

export default Profile;