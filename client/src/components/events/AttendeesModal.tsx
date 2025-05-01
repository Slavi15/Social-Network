import { useState } from "react";
import Modal from "../helpers/Modal";
import FriendInfo from "../profile/FriendInfo";
import { useGetUserQuery } from "../../redux/users/usersApi";
import styles from '../../styles/components/events/Events.module.scss'

interface AttendeesModalProps {
    attendees: string[];
}

const AttendeesModal: React.FC<AttendeesModalProps> = ({
    attendees
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className={styles.creatorModal}>
            <div className={styles.statItem}
                onClick={() => setIsModalOpen(true)}
                style={{ cursor: 'pointer' }}>
                <span className={styles.statLabel}>Attendees</span>
                <span className={styles.statNumber}>{attendees.length || 0}</span>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {attendees.map(id => {
                    const { data: user } = useGetUserQuery(id as string, {
                        pollingInterval: 5000,
                        refetchOnFocus: true,
                        refetchOnReconnect: true
                    });

                    return user && (
                        <FriendInfo
                            key={id}
                            friend={user}
                            showFriends={true}
                            shouldCreateChat={false}
                        />
                    )
                })}
            </Modal>
        </div>
    )
}

export default AttendeesModal;