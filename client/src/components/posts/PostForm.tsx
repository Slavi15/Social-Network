import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useCreatePostMutation } from '../../redux/posts/postsApi';
import MarkdownEditor from './MarkdownEditor';
import { useAuth } from '../../redux/auth/authHooks';
import styles from "../../styles/components/posts/PostForm.module.scss";

export enum Privacy {
    PUBLIC = 0b001,
    FRIENDS = 0b010,
    PRIVATE = 0b100,
};

interface PostProps {
    user_id: string;
    content: string;
    privacy: Privacy;
}

interface PostFormProps {
    onSuccess?: () => void;
}

const PostForm = ({ onSuccess }: PostFormProps) => {
    const [createPost] = useCreatePostMutation();
    const { user } = useAuth();

    const initialValues: PostProps = {
        user_id: user?.id || '',
        content: '',
        privacy: Privacy.FRIENDS,
    };

    const validationSchema = Yup.object().shape({
        user_id: Yup.string().required('User ID is required'),
        content: Yup.string()
            .required('Content is required')
            .max(200, 'Content must be 200 characters or less'),
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
                {({ isSubmitting, isValid }) => (
                    <Form className={styles.form}>
                        <MarkdownEditor name="content" />

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