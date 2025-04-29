import { useParams } from "react-router";
import { useGetEventByIdQuery, useJoinEventMutation, useLeaveEventMutation } from "../../redux/events/eventsApi";
import { useAuth } from "../../redux/auth/authHooks";
import styles from '../../styles/components/events/Events.module.scss'

const EventComponent = () => {
    const { user } = useAuth();
    const { eventId } = useParams<{ eventId: string }>();

    const { data: event, isLoading, isError } = useGetEventByIdQuery(eventId as string);
    const [joinEvent] = useJoinEventMutation();
    const [leaveEvent] = useLeaveEventMutation();

    if (isLoading || isError) return;

    const isAttending = event?.attendees.includes(user?._id as string);
    const isCreator = event?.creators.includes(user?._id as string);

    const handleJoinLeave = async () => {
        try {
            if (isAttending) {
                await leaveEvent({
                    eventId: eventId as string,
                    userId: user?._id as string
                }).unwrap();
            } else {
                await joinEvent({
                    eventId: eventId as string,
                    userId: user?._id as string
                }).unwrap();
            }
        } catch (error) {
            console.error('Error updating attendance:', error);
        }
    };

    return (
        <div className={styles.eventDetails}>
            {event?.banner?.url && (
                <div className={styles.bannerContainer}>
                    <img src={event?.banner.url} alt={event?.title} className={styles.banner} />
                </div>
            )}

            <h2 className={styles.title}>{event?.title}</h2>

            <div className={styles.meta}>
                <span className={styles.date}>
                    {new Date(event?.date as string).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </span>
                <span className={styles.attendees}>
                    {event?.attendees.length} attending
                </span>
            </div>

            <div className={styles.description}>
                {event?.description}
            </div>

            {!isCreator && (
                <button
                    onClick={handleJoinLeave}
                    className={`${styles.joinButton} ${isAttending ? styles.attending : ''}`}
                >
                    {isAttending ? 'Leave Event' : 'Join Event'}
                </button>
            )}
        </div>
    )
}

export default EventComponent;