import { FC, useState } from 'react';
import { useLikePostMutation, useAddCommentMutation } from '../../redux/posts/postsApi';
import { useAuth } from '../../redux/auth/authHooks';
import PostHeader from './elements/PostHeader';
import PostContent from './elements/PostContent';
import PostActions from './elements/PostActions';
import PostComments from './elements/PostComments';
import styles from '../../styles/components/posts/Post.module.scss';
import { IPost } from '../../redux/types/posts';

const Post: FC<IPost> = ({
    _id,
    user_id,
    content,
    media,
    likes,
    comments,
    privacy,
    createdAt
}) => {
    const { user } = useAuth();
    const [likePost] = useLikePostMutation();
    const [addComment] = useAddCommentMutation();
    const [showComments, setShowComments] = useState(false);

    const isLiked = user ? likes.includes(user.id) : false;
    const likeCount = likes.length;
    const commentCount = comments.length;

    const handleLike = async () => {
        if (!user) return;
        try {
            await likePost({ postId: _id, userId: user.id }).unwrap();
        } catch (error) {
            console.error('Failed to like post:', error);
        }
    };

    const handleAddComment = async (commentText: string) => {
        if (!user || !commentText.trim()) return;
        try {
            await addComment({
                postId: _id,
                userId: user.id,
                content: commentText
            }).unwrap();
        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    };

    return (
        <article className={styles.post}>
            <PostHeader
                user_id={user_id}
                privacy={privacy}
                createdAt={createdAt}
            />

            <PostContent content={content} media={media} />

            <PostActions
                isLiked={isLiked}
                likeCount={likeCount}
                commentCount={commentCount}
                onLike={handleLike}
                onToggleComments={() => setShowComments(!showComments)}
            />

            {showComments && (
                <PostComments
                    comments={comments}
                    onAddComment={handleAddComment}
                    postId={_id}
                />
            )}
        </article>
    );
};

export default Post;