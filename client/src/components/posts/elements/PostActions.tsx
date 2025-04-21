import { FC } from 'react';
import styles from '../../../styles/components/posts/Post.module.scss';

interface PostActionsProps {
    isLiked: boolean;
    likeCount: number;
    commentCount: number;
    onLike: () => void;
    onToggleComments: () => void;
}

const PostActions: FC<PostActionsProps> = ({
    isLiked,
    likeCount,
    commentCount,
    onLike,
    onToggleComments
}) => {
    return (
        <div className={styles.postActions}>
            <button
                onClick={onLike}
                className={`${styles.actionButton} ${isLiked ? styles.liked : ''}`}
            >
                <span className={styles.icon}>Likes</span>
                <span className={styles.count}>{likeCount}</span>
            </button>

            <button
                onClick={onToggleComments}
                className={styles.actionButton}
            >
                <span className={styles.icon}>Comments</span>
                <span className={styles.count}>{commentCount}</span>
            </button>
        </div>
    );
};

export default PostActions;