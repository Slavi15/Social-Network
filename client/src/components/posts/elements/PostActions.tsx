import { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp as farThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { faThumbsUp as fasThumbsUp } from '@fortawesome/free-solid-svg-icons';
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
                className={styles.actionButton}
            >
                {isLiked ? (
                    <FontAwesomeIcon icon={fasThumbsUp} />
                ) : (
                    <FontAwesomeIcon icon={farThumbsUp} />
                )}
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