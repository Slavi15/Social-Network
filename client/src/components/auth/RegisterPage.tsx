import { Link } from 'react-router-dom';
import RegisterForm from './widgets/RegisterForm';
import { useAuth } from '../../redux/auth/authHooks';

const RegisterPage = () => {
    const { register } = useAuth();

    return (
        <div className="auth-page">
            <h1>Register</h1>
            <RegisterForm onSuccess={() => { register }} />
            <p className="auth-switch">
                Already have an account? <Link to="/login">Sign in</Link>
            </p>
        </div>
    );
};

export default RegisterPage;