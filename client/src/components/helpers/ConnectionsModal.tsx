import { useState } from "react";
import { IConnection } from "../../redux/types/users";
import { IUser } from "../../redux/types";
import Modal from "./Modal";
import FriendInfo from "../profile/FriendInfo";
import styles from '../../styles/components/helpers/ConnectionsModal.module.scss'

interface ConnectionModalProps {
    user: IUser;
    connection: IConnection;
}

const ConnectionsModal: React.FC<ConnectionModalProps> = ({
    user,
    connection
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    return (
        <div className={styles.connectionModal}>
            <div className={styles.connInfo}>
                <h2 className={styles.username}>{user.username}</h2>
                <p
                    className={styles.mutualInfo}
                    onClick={() => setIsModalOpen(true)}>Mutual Friends {connection.mutualCount} </p>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {user.friends.map((friend: IUser) => (
                    <FriendInfo key={friend._id} friend={friend} />
                ))}
            </Modal>
        </div>
    )
}

export default ConnectionsModal;