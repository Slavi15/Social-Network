import { FC, useState } from 'react';
import { useAuth } from '../../../redux/auth/authHooks';
import { useDeleteCommentMutation, useEditCommentMutation } from '../../../redux/posts/postsApi';
import styles from '../../../styles/components/posts/Post.module.scss';

interface CommentUser {
    _id: string;
    username: string;
    profile_picture?: string;
}

interface PostCommentProps {
    comment: {
        _id: string;
        user_id: CommentUser;
        content: string;
        createdAt: string;
    };
    postId: string;
}

const PostComment: FC<PostCommentProps> = ({ comment, postId }) => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const [editComment] = useEditCommentMutation();
    const [deleteComment] = useDeleteCommentMutation();

    const getAvatarURI = (str: string) => {
        return `data:image/svg+xml;utf8,${encodeURIComponent(str)}`;
    };

    const handleEdit = async () => {
        try {
            await editComment({
                postId,
                commentId: comment._id,
                content: editedContent
            }).unwrap();
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to edit comment:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteComment({
                postId,
                commentId: comment._id
            }).unwrap();
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

    const isCurrentUser = user?.id === comment.user_id._id;

    return (
        <div className={styles.comment}>
            <div className={styles.commentHeader}>
                <img
                    src={getAvatarURI(comment.user_id.profile_picture || '')}
                    alt={comment.user_id.username}
                    className={styles.commentAvatar}
                />

                <strong className={styles.commentUser}>{comment.user_id.username}</strong>

                <time dateTime={comment.createdAt}>
                    {new Date(comment.createdAt).toLocaleString()}
                </time>
            </div>

            <div className={styles.commentContent}>
                {isEditing ? (
                    <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className={styles.commentEditTextarea}
                        autoFocus
                    />
                ) : (
                    <p className={styles.commentText}>{comment.content}</p>
                )}
            </div>

            {isCurrentUser && (
                <div className={styles.commentActions}>
                    {!isEditing ? (
                        <>
                            <button
                                onClick={() => setIsEditing(true)}
                                className={styles.commentActionButton}
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className={styles.commentActionButton}
                            >
                                Delete
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleEdit}
                                className={styles.commentActionButton}
                            >
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditedContent(comment.content);
                                }}
                                className={styles.commentActionButton}
                            >
                                Cancel
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default PostComment;
