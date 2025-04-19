import { Link } from 'react-router-dom';
import LoginForm from './widgets/LoginForm';
import { useAuth } from '../../redux/auth/authHooks';

import styles from '../../styles/components/auth/AuthPage.module.scss'

const LoginPage = () => {
    const { login } = useAuth();

    return (
        <div className={styles.authPage}>
            <h1 className={styles.title}>Login Page</h1>
            <LoginForm onSuccess={() => { login }} />
            <p className={styles.authRedirect}>
                Don't have an account? <Link to="/register">Sign up</Link>
            </p>
        </div>
    );
};

export default LoginPage;