import { IPost } from '../../redux/types/posts';
import UserPost from './UserPost';
import styles from '../../styles/components/posts/Posts.module.scss';

interface PostsProps {
    getPosts: (userId: string) => {
        data?: IPost[];
        isLoading: boolean;
        error?: any;
    };
    userId: string;
}

const Posts: React.FC<PostsProps> = ({ 
    getPosts, 
    userId 
}) => {
    const { data: posts, isLoading, error } = getPosts(userId as string);

    if (isLoading) return <div className={styles.loading}>Loading posts...</div>;
    if (error) return <div className={styles.error}>Error loading posts</div>;
    if (!posts || posts.length === 0) return <div className={styles.empty}>No posts to display</div>;

    return (
        <div className={styles.posts}>
            {posts.map((post: IPost) => (
                <UserPost key={post._id} {...post} />
            ))}
        </div>
    );
};

export default Posts;