import { FC, useState } from 'react';
import { IComment, PostType } from '../../../redux/types/posts';
import BasePostComment from './BasePostComment';
import styles from '../../../styles/components/posts/Post.module.scss';
import { useParams } from 'react-router';

interface BasePostCommentsProps {
    comments: IComment[];
    onAddComment: (content: string) => void;
    postId: string;
    postType: PostType;
}

const BasePostComments: FC<BasePostCommentsProps> = ({
    comments,
    onAddComment,
    postId,
    postType
}) => {
    const { eventId } = useParams<string>();
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
                        <BasePostComment
                            key={comment._id}
                            comment={comment}
                            postId={postId}
                            postType={postType}
                            eventId={eventId}
                        />
                    ))
                ) : (
                    <p className={styles.noComments}>No comments yet</p>
                )}
            </div>
        </div>
    );
};

export default BasePostComments;