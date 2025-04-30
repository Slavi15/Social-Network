import { useState } from 'react';
import PostForm from './PostForm';
import Modal from '../helpers/Modal';
import styles from '../../styles/components/helpers/PostFormModal.module.scss';

const PostFormModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className={styles.postModalButton}
            >
                Post
            </button>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <PostForm onSuccess={() => setIsModalOpen(false)} />
            </Modal>
        </>
    );
};

export default PostFormModal;