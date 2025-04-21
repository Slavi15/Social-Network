import { FC } from 'react';
import { Privacy } from '../../../redux/types/posts';
import styles from '../../../styles/components/posts/Post.module.scss';

interface PostHeaderProps {
    user_id: {
        _id: string;
        username: string;
        profile_picture: string;
    };
    privacy: Privacy;
    createdAt: string;
}

const PostHeader: FC<PostHeaderProps> = ({ user_id, privacy, createdAt }) => {
    const getAvatarURI = (str: string) => {
        return `data:image/svg+xml;utf8,${encodeURIComponent(str)}`
    }

    return (
        <header className={styles.postHeader}>
            <div className={styles.userInfo}>
                <img
                    src={getAvatarURI(user_id.profile_picture as string)}
                    alt={user_id.username}
                    className={styles.profile_picture}
                />

                <div className={styles.userDetails}>
                    <h3>{user_id.username}</h3>
                </div>

                <div className={styles.postDetails}>
                    <time dateTime={createdAt}>
                        {new Date(createdAt).toLocaleString()}
                    </time>
                    
                    <span className={styles.privacy}>
                        {privacy === Privacy.PUBLIC ? 'Public' :
                            privacy === Privacy.FRIENDS ? 'Friends' : 'Private'}
                    </span>
                </div>
            </div>
        </header>
    );
};

export default PostHeader;