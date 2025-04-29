import { Formik, Form, Field } from 'formik';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginSchema } from '../../../schemas/auth';
import { InputField } from '../../widgets/InputField';
import { useLoginMutation } from '../../../redux/auth/authApi';

import styles from "../../../styles/components/auth/widgets/AuthForm.module.scss"

const LoginForm = ({ onSuccess }: { onSuccess: () => void }) => {
    const [login, { isLoading }] = useLoginMutation();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    return (
        <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={async (values, { setSubmitting, setErrors }) => {
                try {
                    await login(values).unwrap();
                    onSuccess();
                    navigate(from, { replace: true });
                } catch (error: any) {
                    setErrors({
                        email: ' ',
                        password: error.data?.message || 'Invalid credentials',
                    });
                } finally {
                    setSubmitting(false);
                }
            }}
        >
            {({ isSubmitting, isValid, dirty }) => (
                <Form className={styles.form}
                    style={{ minHeight: "40vh" }}>
                    <Field
                        name="email"
                        type="email"
                        label="Email"
                        component={InputField}
                        placeholder="Enter your email"
                    />
                    <Field
                        name="password"
                        type="password"
                        label="Password"
                        component={InputField}
                        placeholder="Enter your password"
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting || !isValid || !dirty || isLoading}
                        className={styles.formButton}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </Form>
            )}
        </Formik>
    );
};

export default LoginForm;
