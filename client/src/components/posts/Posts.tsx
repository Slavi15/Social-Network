import { useGetVisiblePostsQuery } from '../../redux/posts/postsApi';
import Post from './Post';
import { useAuth } from '../../redux/auth/authHooks';
import { IPost } from '../../redux/types/posts';
import styles from '../../styles/components/posts/Posts.module.scss';

const Posts = () => {
    const { user } = useAuth();
    const { data: posts, isLoading, error } = useGetVisiblePostsQuery(user?.id || '');

    if (isLoading) return <div className={styles.loading}>Loading posts...</div>;
    if (error) return <div className={styles.error}>Error loading posts</div>;
    if (!posts || posts.length === 0) return <div className={styles.empty}>No posts to display</div>;

    return (
        <div className={styles.posts}>
            {posts.map((post: IPost) => (
                <Post key={post._id} {...post} />
            ))}
        </div>
    );
};

export default Posts;