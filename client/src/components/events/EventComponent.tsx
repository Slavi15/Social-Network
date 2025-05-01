import { useParams } from "react-router";
import { useGetEventByIdQuery, useJoinEventMutation, useLeaveEventMutation } from "../../redux/events/eventsApi";
import { useAuth } from "../../redux/auth/authHooks";
import EventPostFormModal from "./EventPostFormModal";
import EventPosts from "./EventPosts";
import CreatorsModal from "./CreatorsModal";
import AttendeesModal from "./AttendeesModal";
import ToggleCreatorsModal from "./ToggleCreatorsModal";
import styles from '../../styles/components/events/Events.module.scss';

const EventComponent = () => {
    const { user } = useAuth();
    const { eventId } = useParams<{ eventId: string }>();

    const { data: event, isLoading, isError } = useGetEventByIdQuery(eventId as string, {
        pollingInterval: 1000,
        refetchOnFocus: true,
        refetchOnReconnect: true,
        refetchOnMountOrArgChange: true
    });
    const [joinEvent] = useJoinEventMutation();
    const [leaveEvent] = useLeaveEventMutation();

    if (isLoading || isError || !event) return;

    const isAttending = event.attendees.includes(user?._id as string);
    const isCreator = event.creators.includes(user?._id as string);

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
        <div style={{ margin: '4vh auto' }}>
            <div className={styles.eventDetails}>
                <div className={styles.eventHeader}>
                    <div className={styles.statItems}>
                        <CreatorsModal creators={event.creators} />
                        <AttendeesModal attendees={event.attendees} />

                        {isCreator ? (
                            <ToggleCreatorsModal eventId={eventId as string} />
                        ) : (
                            <div className={styles.eventActions}>
                                <button
                                    onClick={handleJoinLeave}
                                    className={styles.joinButton}
                                >
                                    {isAttending ? 'Leave' : 'Join'}
                                </button>
                            </div>
                        )}
                    </div>

                    {event.banner?.url && (
                        <div className={styles.bannerContainer}>
                            <img src={event.banner.url} alt={event.title} className={styles.banner} />
                        </div>
                    )}
                </div>

                <div className={styles.eventContent}>
                    <h2 className={styles.title}>{event.title}</h2>

                    <div className={styles.description}>
                        {event.description}
                    </div>

                    <div className={styles.meta}>
                        <span className={styles.date}>
                            {new Date(event.date as string).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>
                </div>
            </div>
            {isCreator && (
                <EventPostFormModal eventId={eventId as string} />
            )}
            <EventPosts eventId={eventId as string} eventName={event.title} />
        </div>
    )
}

export default EventComponent;