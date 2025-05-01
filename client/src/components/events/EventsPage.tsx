import { useState } from "react";
import { useGetEventsQuery } from "../../redux/events/eventsApi";
import EventModal from "./EventModal";
import EventCard from "./EventCard";
import { IEvent } from "../../redux/types/events";
import styles from '../../styles/components/events/Events.module.scss'

const EventsPage = () => {
    const { data: events, isLoading, isError } = useGetEventsQuery(undefined, {
        pollingInterval: 1000,
        refetchOnFocus: true,
        refetchOnReconnect: true,
        refetchOnMountOrArgChange: true
    });
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    if (isLoading || isError) return;

    return (
        <div className={styles.eventsPage}>
            <div className={styles.header}>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className={styles.createButton}
                >
                    Create Event
                </button>
            </div>

            <div className={styles.eventsGrid}>
                {events && events?.map((event: IEvent) => (
                    <EventCard
                        key={event._id}
                        eventInfo={event}
                    />
                ))}
            </div>

            <EventModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    )
}

export default EventsPage;