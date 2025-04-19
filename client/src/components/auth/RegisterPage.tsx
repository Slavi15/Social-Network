import { Link } from 'react-router-dom';
import RegisterForm from './widgets/RegisterForm';
import { useAuth } from '../../redux/auth/authHooks';

import styles from '../../styles/components/auth/AuthPage.module.scss'

const RegisterPage = () => {
    const { register } = useAuth();

    return (
        <div className={styles.authPage}>
            <h1 className={styles.title}>Register Page</h1>
            <RegisterForm onSuccess={() => { register }} />
            <p className={styles.authRedirect}>
                Already have an account? <Link to="/login">Sign in</Link>
            </p>
        </div>
    );
};

export default RegisterPage;