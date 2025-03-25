import { Formik, Form, Field } from 'formik';
import { LoginSchema } from '../../schemas/auth';
import { InputField } from './InputField';
import { useLoginMutation } from '../../redux/auth/authApi';

const LoginForm = () => {
    const [login, { isLoading }] = useLoginMutation();

    return (
        <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={async (values, { setSubmitting, setErrors }) => {
                try {
                    await login(values).unwrap();
                } catch (error: any) {
                    setErrors({ email: ' ', password: 'Invalid credentials' });
                } finally {
                    setSubmitting(false);
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
                        className={`submit-btn ${isSubmitting ? 'loading' : ''}`}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner" /> Logging in...
                            </>
                        ) : (
                            'Login'
                        )}
                    </button>
                </Form>
            )}
        </Formik>
    );
};

export default LoginForm;
