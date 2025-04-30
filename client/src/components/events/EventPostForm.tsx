import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useCreateEventPostMutation } from '../../redux/events/eventsApi';
import MarkdownEditor from '../posts/MarkdownEditor';
import { useAuth } from '../../redux/auth/authHooks';
import styles from "../../styles/components/posts/PostForm.module.scss";
import { MediaProps } from '../../redux/types/posts';
import { IUser } from '../../redux/types/users';

interface EventPostProps {
    user_id: IUser | null;
    content: string;
    media: MediaProps | null;
}

interface EventPostFormProps {
    eventId: string;
    onSuccess?: () => void;
}

const EventPostForm: React.FC<EventPostFormProps> = ({
    eventId,
    onSuccess
}) => {
    const [createEventPost] = useCreateEventPostMutation();
    const { user } = useAuth();

    const initialValues: EventPostProps = {
        user_id: user,
        content: '',
        media: null,
    };

    const validationSchema = Yup.object().shape({
        user_id: Yup.object().shape({
            _id: Yup.string().required(),
            username: Yup.string(),
            profile_picture: Yup.string()
        }).required(),
        content: Yup.string()
            .max(250, 'Content must be 250 characters or less')
            .required('Content is required'),
        media: Yup.object().nullable(),
    });

    const handleSubmit = async (values: EventPostProps, { resetForm }: any) => {
        try {
            await createEventPost({
                eventId,
                postData: values
            }).unwrap();
            resetForm();
            onSuccess?.();
        } catch (error) {
            console.error('Failed to create event post:', error);
        }
    };

    return (
        <div className={styles.postForm}>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize={true}
            >
                {({ values, isSubmitting, isValid }) => (
                    <Form className={styles.form}>
                        <MarkdownEditor name="content" media={values.media} />

                        <button
                            type="submit"
                            disabled={!isValid || isSubmitting}
                            className={styles.postButton}
                        >
                            {isSubmitting ? 'Posting...' : 'Post to Event'}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default EventPostForm;