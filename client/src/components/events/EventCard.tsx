import { Link } from "react-router";
import { IEvent } from "../../redux/types/events";
import styles from '../../styles/components/events/Events.module.scss'

interface EventCardProps {
    eventInfo: IEvent;
}

const EventCard: React.FC<EventCardProps> = ({
    eventInfo
}) => {
    return (
        <Link to={`/events/${eventInfo._id}`}>
            <div className={styles.eventCard}>
                {eventInfo.banner?.url && (
                    <div className={styles.bannerContainer}>
                        <img src={eventInfo.banner.url}
                            alt={eventInfo.title}
                            className={styles.banner} />
                    </div>
                )}

                <div className={styles.content}>
                    <h3 className={styles.title}>{eventInfo.title}</h3>
                    <p className={styles.date}>
                        {new Date(eventInfo.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </p>
                </div>
            </div>
        </Link>
    )
}

export default EventCard;