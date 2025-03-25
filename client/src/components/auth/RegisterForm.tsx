import { Formik, Form, Field } from 'formik';
// import { useNavigate } from 'react-router-dom';
import { RegisterSchema } from '../../schemas/auth';
import { InputField } from './InputField';
import { useRegisterMutation } from '../../redux/auth/authApi';

const RegisterForm = ({ onSuccess }: { onSuccess: () => void }) => {
    const [register, { isLoading }] = useRegisterMutation();
    // const navigate = useNavigate();

    return (
        <Formik
            initialValues={{
                username: '',
                email: '',
                password: ''
            }}
            validationSchema={RegisterSchema}
            onSubmit={async (values, { setSubmitting, setErrors }) => {
                try {
                    const { ...registerData } = values;
                    await register(registerData).unwrap();
                    onSuccess();
                } catch (error: any) {
                    setErrors({
                        email: ' ',
                        password: 'Registration failed',
                    });
                } finally {
                    setSubmitting(false);
                    // navigate('/');
                }
            }}
        >
            {({ isSubmitting, isValid, dirty }) => (
                <Form className="auth-form">
                    <Field
                        name="username"
                        type="text"
                        label="Username"
                        component={InputField}
                        placeholder="Enter your username"
                    />

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
                        Register
                    </button>
                </Form>
            )}
        </Formik>
    );
};

export default RegisterForm;