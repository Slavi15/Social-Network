import { Formik, Form, Field } from 'formik';
// import { useNavigate } from 'react-router-dom';
import { LoginSchema } from '../../schemas/auth';
import { InputField } from './InputField';
import { useLoginMutation } from '../../redux/auth/authApi';

const LoginForm = ({ onSuccess }: { onSuccess: () => void }) => {
    const [login, { isLoading }] = useLoginMutation();
    // const navigate = useNavigate();

    return (
        <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={async (values, { setSubmitting, setErrors }) => {
                try {
                    await login(values).unwrap();
                    onSuccess();
                } catch (error: any) {
                    setErrors({ email: ' ', password: 'Invalid credentials' });
                } finally {
                    setSubmitting(false);
                    // navigate('/');
                }
            }}
        >
            {({ isSubmitting, isValid, dirty }) => (
                <Form className="auth-form">
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
                        className={`submit-btn`}
                    >
                        Login
                    </button>
                </Form>
            )}
        </Formik>
    );
};

export default LoginForm;
