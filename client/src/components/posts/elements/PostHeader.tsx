import { FC } from 'react';
import { Privacy } from '../../../redux/types/posts';
import ProfilePicture, { ImageSize } from '../../profile/ProfilePicture';
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

const PostHeader: FC<PostHeaderProps> = ({ 
    user_id, 
    privacy, 
    createdAt 
}) => {
    return (
        <header className={styles.postHeader}>
            <div className={styles.userInfo}>
                <ProfilePicture
                    userId={user_id._id as string}
                    username={user_id.username}
                    profilePicture={user_id.profile_picture as string}
                    size={ImageSize.SMALL}
                    linkToProfile={true} />

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