import { useState } from "react";
import Modal from "./Modal";
import FriendInfo from "../profile/FriendInfo";
import { UserProfile } from "../profile/Profile";
import styles from '../../styles/components/helpers/FriendsModal.module.scss'
import { IUser } from "../../redux/types/users";

interface FriendsModalProps {
    user: UserProfile;
}

const FriendsModal: React.FC<FriendsModalProps> = ({
    user
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className={styles.friendsModal}>
            <div className={styles.statItem} onClick={() => setIsModalOpen(true)}>
                <span className={styles.statLabel}>Friends</span>
                <span className={styles.statNumber}>{user.friends?.length || 0}</span>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {user?.friends?.map((friend: IUser) => (
                    <FriendInfo key={friend._id} friend={friend} />
                ))}
            </Modal>
        </div>
    )
}

export default FriendsModal;