import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useCreatePostMutation } from '../../redux/posts/postsApi';
import MarkdownEditor from './MarkdownEditor';
import { useAuth } from '../../redux/auth/authHooks';
import { Privacy } from '../../redux/types/posts';
import styles from "../../styles/components/posts/PostForm.module.scss";

interface MediaProps {
    url: string;
    delete_url: string;
    filename: string;
}

interface PostProps {
    user_id: string;
    content: string;
    media: MediaProps | null;
    privacy: Privacy;
}

interface PostFormProps {
    onSuccess?: () => void;
}

const PostForm = ({ onSuccess }: PostFormProps) => {
    const [createPost] = useCreatePostMutation();
    const { user } = useAuth();

    const initialValues: PostProps = {
        user_id: user?.id as string,
        content: '',
        media: null,
        privacy: Privacy.FRIENDS,
    };

    const validationSchema = Yup.object().shape({
        user_id: Yup.string().required('User ID is required'),
        content: Yup.string()
            .max(250, 'Content must be 200 characters or less')
            .required('Content is required'),
        media: Yup.object().nullable(),
        privacy: Yup.number()
            .oneOf([Privacy.PUBLIC, Privacy.FRIENDS, Privacy.PRIVATE])
            .required('Privacy setting is required'),
    });

    const handleSubmit = async (values: PostProps, { resetForm }: any) => {
        try {
            await createPost(values).unwrap();
            resetForm();
            onSuccess?.();
        } catch (error) {
            console.error('Failed to create post:', error);
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
                            {isSubmitting ? 'Posting...' : 'Post'}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default PostForm;