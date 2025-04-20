import { useState } from 'react';
import PostForm from '../posts/PostForm';
import Modal from './Modal';
import styles from '../../styles/components/helpers/PostFormModal.module.scss';

const PostFormModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className={styles.prePost}>
                <div className={styles.postMotto}>What's on your mind?</div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className={styles.openModalButton}
                >
                    Post
                </button>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <PostForm onSuccess={() => setIsModalOpen(false)} />
            </Modal>
        </>
    );
};

export default PostFormModal;