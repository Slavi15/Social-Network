import { useGetEventPostsQuery } from "../../redux/events/eventsApi";
import { IPost } from "../../redux/types/posts";
import EventPost from "../posts/EventPost";
import styles from '../../styles/components/events/Events.module.scss';

interface EventPostsProps {
    eventId: string;
    eventName: string;
}

const EventPosts: React.FC<EventPostsProps> = ({
    eventId,
    eventName
}) => {
    const { data: posts, isLoading, isError } = useGetEventPostsQuery(eventId as string);

    if (isLoading) return <div>Loading posts...</div>;
    if (isError) return <div>Error loading posts</div>;

    return (
        <div className={styles.eventPosts}>
            {posts?.map((post: IPost) => (
                <EventPost 
                    key={post._id} 
                    {...post}
                    eventId={eventId}
                    eventName={eventName} />
            ))}
        </div>
    );
};

export default EventPosts;