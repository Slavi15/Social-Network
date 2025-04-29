import Modal from '../helpers/Modal';
import EventForm from './EventForm';
import styles from '../../styles/components/events/Events.module.scss'

interface CreateEventModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateEventModal = ({ isOpen, onClose }: CreateEventModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className={styles.modalEventHeader}>
                <h2>Create Event</h2>
            </div>
            <EventForm onSuccess={onClose} />
        </Modal>
    );
};

export default CreateEventModal;