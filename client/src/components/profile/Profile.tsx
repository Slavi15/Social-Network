import React from "react";
import ProfilePicture, { ImageSize } from "./ProfilePicture";
import FriendsModal from "../helpers/FriendsModal";
import { IUser } from "../../redux/types/users";
import styles from '../../styles/components/profile/ProfilePage.module.scss'

export enum FriendStatus {
    FRIENDS,
    PENDING,
    NONE
}

export interface UserProfile {
    _id: string;
    username: string;
    email: string;
    profile_picture?: string;
    friends?: IUser[];
}

interface ProfileProps {
    user: UserProfile;
    onFriend?: () => void;
    isCurrentUser?: boolean;
    friendStatus: FriendStatus | undefined;
}

const Profile: React.FC<ProfileProps> = ({
    user,
    onFriend,
    isCurrentUser,
    friendStatus
}) => {
    const getButtonText = () => {
        switch (friendStatus) {
            case FriendStatus.FRIENDS: return 'Friends';
            case FriendStatus.PENDING: return 'Pending';
            case FriendStatus.NONE: return 'Add Friend';
            default: return '';
        }
    };

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
                <FriendsModal user={user} />

                {!isCurrentUser && onFriend && (
                    <button
                        onClick={onFriend}
                        className={styles.friendButton}
                    >
                        {getButtonText()}
                    </button>
                )}
            </div>
        </div>
    )
}

export default Profile;