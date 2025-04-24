import Post from './Post';
import styles from '../../styles/components/posts/Posts.module.scss';
import { IPost } from '../../redux/types/posts';

interface PostsProps {
    getPosts: (userId: string) => {
        data?: IPost[];
        isLoading: boolean;
        error?: any;
    };
    userId: string;
}

const Posts = ({ getPosts, userId }: PostsProps) => {
    const { data: posts, isLoading, error } = getPosts(userId as string);

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