import ProfilePicture, { ImageSize } from "./ProfilePicture";
import { IUser } from "../../redux/types";
import styles from '../../styles/components/friends/Friends.module.scss'

interface FriendInfoProps {
    friend: IUser;
}

const FriendInfo: React.FC<FriendInfoProps> = ({
    friend
}) => {
    return (
        <div className={styles.friendInfo}>
            <ProfilePicture
                userId={friend.id as string}
                username={friend.username as string}
                profilePicture={friend.profile_picture as string}
                size={ImageSize.SMALL}
                linkToProfile={true} />

            <h3 className={styles.friendUsername}>{friend.username as string}</h3>

            <div className={styles.statItem}>
                <span className={styles.statLabel}>Friends</span>
                <span className={styles.statNumber}>{friend.friends.length || 0}</span>
            </div>
        </div>
    )
}

export default FriendInfo;