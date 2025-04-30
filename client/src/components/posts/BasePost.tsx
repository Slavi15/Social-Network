import { FC, useState } from 'react';
import { IPost } from '../../redux/types/posts';
import BasePostContent from './elements/BasePostContent';
import BasePostActions from './elements/BasePostActions';
import BasePostComments from './elements/BasePostComments';
import { useAuth } from '../../redux/auth/authHooks';
import { PostType } from '../../redux/types/posts';
import styles from '../../styles/components/posts/Post.module.scss';

interface BasePostProps extends IPost {
    postType: PostType;
    onLike: () => void;
    onAddComment: (content: string) => void;
    onDelete: () => void;
    renderHeader: () => React.ReactNode;
    canDelete?: boolean;
}

const BasePost: FC<BasePostProps> = ({
    _id,
    content,
    media,
    likes,
    comments,
    postType,
    onLike,
    onAddComment,
    onDelete,
    renderHeader,
    canDelete = true,
}) => {
    const { user } = useAuth();
    const [showComments, setShowComments] = useState(false);

    const isLiked = likes.includes(user?._id as string);
    const likeCount = likes.length;
    const commentCount = comments.length;

    return (
        <article className={styles.post}>
            {renderHeader()}

            <BasePostContent content={content} media={media} />

            <BasePostActions
                isLiked={isLiked}
                likeCount={likeCount}
                commentCount={commentCount}
                onLike={onLike}
                onDelete={onDelete}
                onToggleComments={() => setShowComments(!showComments)}
                canDelete={canDelete}
            />

            {showComments && (
                <BasePostComments
                    comments={comments}
                    onAddComment={onAddComment}
                    postId={_id}
                    postType={postType}
                />
            )}
        </article>
    );
};

export default BasePost;