import { FC } from 'react';
import { useLikePostMutation, useAddCommentMutation, useDeletePostMutation } from '../../redux/posts/postsApi';
import BasePost from './BasePost';
import BasePostHeader from './elements/BasePostHeader';
import { IPost, PostType } from '../../redux/types/posts';
import { useAuth } from '../../redux/auth/authHooks';

interface UserPostProps extends IPost { }

const UserPost: FC<UserPostProps> = (post) => {
    const { user } = useAuth();
    const [likePost] = useLikePostMutation();
    const [addComment] = useAddCommentMutation();
    const [deletePost] = useDeletePostMutation();

    const handleLike = async () => {
        if (!user) return;
        await likePost({ postId: post._id, userId: user._id });
    };

    const handleAddComment = async (content: string) => {
        if (!user || !content.trim()) return;
        await addComment({ postId: post._id, userId: user._id, content });
    };

    const handleDelete = async () => {
        if (!user) return;
        await deletePost(post._id);
    };

    const renderHeader = () => (
        <BasePostHeader
            user={post.user_id}
            privacy={post.privacy}
            createdAt={post.createdAt}
        />
    );

    return (
        <BasePost
            {...post}
            postType={PostType.USER}
            onLike={handleLike}
            onAddComment={handleAddComment}
            onDelete={handleDelete}
            renderHeader={renderHeader}
            canDelete={user?._id === post.user_id._id}
        />
    );
};

export default UserPost;