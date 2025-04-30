import React, { useState } from "react";
import styles from '../../styles/components/events/Events.module.scss'
import { useAddCreatorMutation, useDeleteEventMutation } from "../../redux/events/eventsApi";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Modal from "../helpers/Modal";
import SearchForm from "../chats/SearchForm";
import { IUser } from "../../redux/types/users";

interface ToggleCreatorsProps {
    eventId: string;
}

const ToggleCreatorsModal: React.FC<ToggleCreatorsProps> = ({
    eventId
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const [addCreator] = useAddCreatorMutation();
    const [deleteEvent] = useDeleteEventMutation();

    const handleDelete = async () => {
        try {
            await deleteEvent(eventId as string).unwrap();
            navigate("/events");
        } catch (err) {
            console.error(err);
        }
    }

    const handleAddCreator = async (user: IUser) => {
        if (!user) return;

        console.log(user);

        try {
            await addCreator({
                eventId,
                creatorId: user._id as string,
            }).unwrap();
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className={styles.eventActions}>
            <button
                onClick={() => setIsModalOpen(true)}
                className={styles.joinButton}
            >
                Add
            </button>
            <FontAwesomeIcon onClick={handleDelete} className={styles.trash} icon={faTrash} />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <SearchForm 
                    onToggle={(user: IUser) => handleAddCreator(user)}
                    shouldCreateChat={false} />
            </Modal>
        </div>
    )
}

export default ToggleCreatorsModal;