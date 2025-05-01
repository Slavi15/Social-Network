import { Field, Form, Formik } from "formik";
import { useCreateEventMutation, useUpdateEventMutation } from "../../redux/events/eventsApi";
import { IEvent } from "../../redux/types/events";
import * as Yup from 'yup';
import { InputField } from "../widgets/InputField";
import { TextareaField } from "../widgets/TextareaField";
import ImageUpload from "../posts/ImageUpload";
import { useAuth } from "../../redux/auth/authHooks";
import styles from '../../styles/components/events/Events.module.scss'

interface EventFormProps {
    onSuccess?: () => void;
    eventId?: string;
    isEdit?: boolean;
}

const EventForm: React.FC<EventFormProps> = ({
    onSuccess,
    eventId,
    isEdit = false
}) => {
    const { user } = useAuth();
    const [createEvent] = useCreateEventMutation();
    const [updateEvent] = useUpdateEventMutation();

    const initialValues: Partial<IEvent> = {
        title: '',
        description: '',
        date: new Date().toISOString().slice(0, 16),
        banner: undefined,
        creators: []
    }

    const validationSchema = Yup.object({
        title: Yup.string()
            .required('Title is required'),
        description: Yup.string()
            .min(10, "Minimum 10 characters needed!")
            .required('Description is required'),
        date: Yup.date()
            .required('Date is required')
            .min(new Date(), 'Event date must be in the future'),
        banner: Yup.object().shape({
            url: Yup.string().required(),
            delete_url: Yup.string(),
            filename: Yup.string()
        }).required("Banner is required!")
    });

    const handleSubmit = async (values: Partial<IEvent>) => {
        try {
            const eventData = {
                title: values.title,
                description: values.description,
                date: new Date(values.date as string),
                banner: values.banner,
                creators: [user?._id as string]
            };

            if (isEdit && eventId) {
                await updateEvent({ eventId, updates: eventData }).unwrap();
            } else {
                await createEvent(eventData).unwrap();
            }

            onSuccess?.();
        } catch (err) {
            console.error('Error submitting event:', err);
        }
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ setFieldValue, values }) => (
                <Form className={styles.eventForm}>
                    <Field
                        name="title"
                        type="text"
                        label=""
                        component={InputField}
                        placeholder="Title..."
                    />

                    <Field
                        name="description"
                        type="text"
                        label=""
                        component={TextareaField}
                        placeholder="Description..."
                    />

                    <Field
                        name="date"
                        type="datetime-local"
                        label=""
                        component={InputField}
                        placeholder="Date..."
                    />

                    <div className={styles.bannerForm}>
                        <ImageUpload
                            onUploadSuccess={(filename, url, delete_url) => {
                                setFieldValue('banner', { url, delete_url, filename });
                            }}
                        />
                        {values.banner?.url && (
                            <div className={styles.bannerImage}>{values.banner.filename}</div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className={styles.submitButton}
                    >
                        {isEdit ? 'Update Event' : 'Create Event'}
                    </button>
                </Form>
            )}
        </Formik>
    )
}

export default EventForm;