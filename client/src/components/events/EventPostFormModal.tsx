import { useState } from 'react';
import EventPostForm from './EventPostForm';
import Modal from '../helpers/Modal';
import styles from '../../styles/components/helpers/PostFormModal.module.scss';

interface EventPostFormModalProps {
    eventId: string;
}

const EventPostFormModal: React.FC<EventPostFormModalProps> = ({ 
    eventId 
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className={styles.postModalButton}
            >
                Post to Event
            </button>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <EventPostForm
                    eventId={eventId}
                    onSuccess={() => setIsModalOpen(false)}
                />
            </Modal>
        </>
    );
};

export default EventPostFormModal;