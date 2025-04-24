import { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp as farThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { faThumbsUp as fasThumbsUp, faTrash } from '@fortawesome/free-solid-svg-icons';
import styles from '../../../styles/components/posts/Post.module.scss';
import { useDeletePostMutation } from '../../../redux/posts/postsApi';
import { useAuth } from '../../../redux/auth/authHooks';

interface PostActionsProps {
    postId: string;
    isLiked: boolean;
    likeCount: number;
    commentCount: number;
    onLike: () => void;
    onToggleComments: () => void;
}

const PostActions: FC<PostActionsProps> = ({
    postId,
    isLiked,
    likeCount,
    commentCount,
    onLike,
    onToggleComments
}) => {
    const { user } = useAuth();
    const [deletePost] = useDeletePostMutation();

    const handlePostDelete = async () => {
        if (!user) return;
        try {
            await deletePost(postId).unwrap();
        } catch (err) {
            console.log("Cannot delete post!");
        }
    }

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

            <FontAwesomeIcon 
                onClick={handlePostDelete}
                className={styles.postDelete} 
                icon={faTrash} />
        </div>
    );
};

export default PostActions;