import { FC, useState } from 'react';
import PostComment from './PostComment';
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
    postId: string;
}

const PostComments: FC<PostCommentsProps> = ({ comments, onAddComment, postId }) => {
    const [commentText, setCommentText] = useState('');

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
                        <PostComment key={comment._id} comment={comment} postId={postId} />
                    ))
                ) : (
                    <p className={styles.noComments}>No comments yet</p>
                )}
            </div>
        </div>
    );
};

export default PostComments;