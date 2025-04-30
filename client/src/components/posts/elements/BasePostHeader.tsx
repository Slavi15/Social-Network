import { FC } from 'react';
import { IUser } from '../../../redux/types/users';
import ProfilePicture, { ImageSize } from '../../profile/ProfilePicture';
import styles from '../../../styles/components/posts/Post.module.scss';
import { Privacy } from '../../../redux/types/posts';

interface BasePostHeaderProps {
    user: Partial<IUser>;
    privacy?: Privacy;
    createdAt: string;
}

const BasePostHeader: FC<BasePostHeaderProps> = ({
    user,
    privacy,
    createdAt
}) => {
    return (
        <div className={styles.postHeader}>
            <div className={styles.userInfo}>
                <ProfilePicture
                    userId={user._id as string}
                    username={user.username as string}
                    profilePicture={user.profile_picture as string}
                    size={ImageSize.SMALL}
                    linkToProfile={true}
                />

                <div className={styles.userDetails}>
                    <span className={styles.username}>{user.username}</span>
                </div>

                <div className={styles.postDetails}>
                    {privacy && (
                        <span className={styles.privacy}>
                            {privacy === Privacy.FRIENDS ? 'Friends' :
                                privacy === Privacy.PUBLIC ? 'Public' :
                                    'Private'}
                        </span>
                    )}
                    <time dateTime={createdAt}>
                        {new Date(createdAt).toLocaleString()}
                    </time>
                </div>
            </div>
        </div>
    );
};

export default BasePostHeader;