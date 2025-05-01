import { useAuth } from "../../redux/auth/authHooks";
import { useGetVisiblePostsQuery } from "../../redux/posts/postsApi";
import PostFormModal from "./PostFormModal";
import Posts from "./Posts";

const Feed = () => {
    const { user } = useAuth();
    const visiblePostsQuery = (userId: string) => useGetVisiblePostsQuery(userId as string);

    return (
        <div>
            <PostFormModal />
            <Posts
                getPosts={visiblePostsQuery}
                userId={user?._id as string} />
        </div>
    )
}

export default Feed;