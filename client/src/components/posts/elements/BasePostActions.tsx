import { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp as farThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { faThumbsUp as fasThumbsUp, faTrash } from '@fortawesome/free-solid-svg-icons';
import styles from '../../../styles/components/posts/Post.module.scss';

interface BasePostActionsProps {
    isLiked: boolean;
    likeCount: number;
    commentCount: number;
    onLike: () => void;
    onDelete: () => void;
    onToggleComments: () => void;
    canDelete: boolean;
}

const BasePostActions: FC<BasePostActionsProps> = ({
    isLiked,
    likeCount,
    commentCount,
    onLike,
    onDelete,
    onToggleComments,
    canDelete
}) => {
    return (
        <div className={styles.postActions}>
            <button onClick={onLike} className={styles.actionButton}>
                {isLiked ? (
                    <FontAwesomeIcon icon={fasThumbsUp} className={styles.liked} />
                ) : (
                    <FontAwesomeIcon icon={farThumbsUp} />
                )}
                <span className={styles.count}>{likeCount}</span>
            </button>

            <button onClick={onToggleComments} className={styles.actionButton}>
                <span className={styles.icon}>Comments</span>
                <span className={styles.count}>{commentCount}</span>
            </button>

            {canDelete && (
                <button onClick={onDelete} className={styles.deleteButton}>
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            )}
        </div>
    );
};

export default BasePostActions;