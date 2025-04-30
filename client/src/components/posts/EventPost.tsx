import { FC } from 'react';
import { useAuth } from '../../redux/auth/authHooks';
import { useLikeEventPostMutation, useAddCommentToEventPostMutation, useDeleteEventPostMutation } from '../../redux/events/eventsApi';
import BasePost from './BasePost';
import BasePostHeader from './elements/BasePostHeader';
import { IPost, PostType } from '../../redux/types/posts';

interface EventPostProps extends IPost {
    eventId: string;
    eventName: string;
}

const EventPost: FC<EventPostProps> = ({ 
    eventId, 
    eventName, 
    ...post 
}) => {
    const { user } = useAuth();
    const [likePost] = useLikeEventPostMutation();
    const [addComment] = useAddCommentToEventPostMutation();
    const [deletePost] = useDeleteEventPostMutation();

    const handleLike = async () => {
        if (!user) return;

        try {
            await likePost({
                eventId,
                postId: post._id as string,
                userId: user._id as string
            }).unwrap();
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddComment = async (content: string) => {
        if (!user || !content.trim()) return;

        try {
            await addComment({
                eventId,
                postId: post._id as string,
                commentData: {
                    user_id: user,
                    content: content
                }
            }).unwrap();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {
        if (!user) return;

        try {
            await deletePost({
                eventId,
                postId: post._id as string,
                userId: user._id as string
            }).unwrap();
        } catch (err) {
            console.error(err);
        }
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
            postType={PostType.EVENT}
            onLike={handleLike}
            onAddComment={handleAddComment}
            onDelete={handleDelete}
            renderHeader={renderHeader}
            canDelete={user?._id === post.user_id._id || false}
        />
    );
};

export default EventPost;