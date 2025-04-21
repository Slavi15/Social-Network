import { FC, useState } from 'react';
import styles from '../../../styles/components/posts/Post.module.scss';

interface Comment {
    _id: string;
    user_id: {
        _id: string;
        username: string;
        profile_picture?: string;
    };
    content: string;
    createdAt: string;
}

interface PostCommentsProps {
    comments: Comment[];
    onAddComment: (content: string) => void;
}

const PostComments: FC<PostCommentsProps> = ({ comments, onAddComment }) => {
    const [commentText, setCommentText] = useState('');

    const getAvatarURI = (str: string) => {
        return `data:image/svg+xml;utf8,${encodeURIComponent(str)}`
    }

    const handleSubmit = () => {
        onAddComment(commentText);
        setCommentText('');
    };

    return (
        <div className={styles.commentsSection}>
            <div className={styles.commentForm}>
                <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className={styles.commentInput}
                />
                <button
                    onClick={handleSubmit}
                    className={styles.commentSubmit}
                    disabled={!commentText.trim()}
                >
                    Post
                </button>
            </div>

            <div className={styles.commentsList}>
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment._id} className={styles.comment}>
                            <img
                                src={getAvatarURI(comment.user_id.profile_picture || '')}
                                alt={comment.user_id.username}
                                className={styles.commentAvatar}
                            />
                            <div className={styles.commentContent}>
                                <div className={styles.commentHeader}>
                                    <strong>{comment.user_id.username}</strong>
                                    <time dateTime={comment.createdAt}>
                                        {new Date(comment.createdAt).toLocaleString()}
                                    </time>
                                </div>
                                <p>{comment.content}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className={styles.noComments}>No comments yet</p>
                )}
            </div>
        </div>
    );
};

export default PostComments;