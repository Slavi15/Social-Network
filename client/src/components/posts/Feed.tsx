import { useAuth } from "../../redux/auth/authHooks";
import { useGetVisiblePostsQuery } from "../../redux/posts/postsApi";
import PostFormModal from "../helpers/PostFormModal";
import Posts from "./Posts";

const Feed = () => {
    const { user } = useAuth();
    const visiblePostsQuery = (userId: string) => useGetVisiblePostsQuery(userId);

    return (
        <div>
            <PostFormModal />
            <Posts 
                getPosts={visiblePostsQuery}
                userId={user?.id || ''} />
        </div>
    )
}

export default Feed;