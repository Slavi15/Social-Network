import { Link } from 'react-router-dom';
import LoginForm from './widgets/LoginForm';
import { useAuth } from '../../redux/auth/authHooks';

const LoginPage = () => {
    const { login } = useAuth();

    return (
        <div className="auth-page">
            <h1>Login</h1>
            <LoginForm onSuccess={() => { login }} />
            <p className="auth-switch">
                Don't have an account? <Link to="/register">Sign up</Link>
            </p>
        </div>
    );
};

export default LoginPage;