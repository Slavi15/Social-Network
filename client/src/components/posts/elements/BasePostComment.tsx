import { FC, useState } from 'react';
import { useAuth } from '../../../redux/auth/authHooks';
import { useEditCommentMutation, useDeleteCommentMutation } from '../../../redux/posts/postsApi';
import ProfilePicture, { ImageSize } from '../../profile/ProfilePicture';
import { IComment, PostType } from '../../../redux/types/posts';
import { useDeleteCommentEventPostMutation, useEditCommentEventPostMutation } from '../../../redux/events/eventsApi';
import styles from '../../../styles/components/posts/Post.module.scss';

interface BasePostCommentProps {
    comment: IComment;
    postId: string;
    postType: PostType;
    eventId?: string;
}

const BasePostComment: FC<BasePostCommentProps> = ({
    comment,
    postId,
    postType,
    eventId
}) => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);

    const [editRegularComment] = useEditCommentMutation();
    const [deleteRegularComment] = useDeleteCommentMutation();

    const [editEventComment] = useEditCommentEventPostMutation();
    const [deleteEventComment] = useDeleteCommentEventPostMutation();

    const handleEdit = async () => {
        try {
            if (postType === PostType.EVENT && eventId) {
                await editEventComment({
                    eventId,
                    postId,
                    commentId: comment._id,
                    userId: user?._id || '',
                    content: editedContent
                }).unwrap();
            } else {
                await editRegularComment({
                    postId,
                    postType,
                    commentId: comment._id,
                    content: editedContent
                }).unwrap();
            }
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to edit comment:', error);
        }
    };

    const handleDelete = async () => {
        try {
            if (postType === PostType.EVENT && eventId) {
                await deleteEventComment({
                    eventId,
                    postId,
                    commentId: comment._id,
                    userId: user?._id || ''
                }).unwrap();
            } else {
                await deleteRegularComment({
                    postId,
                    postType,
                    commentId: comment._id
                }).unwrap();
            }
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

    const isCurrentUser = user?._id === comment.user_id._id;

    return (
        <div className={styles.comment}>
            <div className={styles.commentHeader}>
                <ProfilePicture
                    userId={comment.user_id._id}
                    username={comment.user_id.username}
                    profilePicture={comment.user_id.profile_picture as string}
                    size={ImageSize.SMALL}
                    linkToProfile
                />
                <strong className={styles.commentUser}>{comment.user_id.username}</strong>
                <time dateTime={comment.createdAt.toLocaleString()}>
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

export default BasePostComment;