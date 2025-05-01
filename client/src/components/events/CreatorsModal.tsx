import { useState } from "react";
import Modal from "../helpers/Modal";
import FriendInfo from "../profile/FriendInfo";
import { useGetUserQuery } from "../../redux/users/usersApi";
import styles from '../../styles/components/events/Events.module.scss'

interface CreatorsModalProps {
    creators: string[];
}

const CreatorsModal: React.FC<CreatorsModalProps> = ({
    creators
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className={styles.creatorModal}>
            <div className={styles.statItem} 
                onClick={() => setIsModalOpen(true)}
                style={{ cursor: 'pointer' }}>
                <span className={styles.statLabel}>Creators</span>
                <span className={styles.statNumber}>{creators.length || 0}</span>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {creators.map(id => {
                    const { data: user } = useGetUserQuery(id as string, {
                        pollingInterval: 1000,
                        refetchOnFocus: true,
                        refetchOnReconnect: true,
                        refetchOnMountOrArgChange: true
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

export default CreatorsModal;