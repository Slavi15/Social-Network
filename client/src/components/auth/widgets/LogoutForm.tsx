import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../../../redux/auth/authApi';

import styles from '../../../styles/components/auth/widgets/LogoutForm.module.scss'

const LogoutForm = () => {
    const [logout, { isLoading }] = useLogoutMutation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout().unwrap();
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            navigate('/');
        }
    };

    return (
        <button
            onClick={handleLogout}
            disabled={isLoading}
            className={`${styles.button} ${isLoading ? styles.loading : ''}`}
        >
            {isLoading ? 'Logging out...' : 'Logout'}
        </button>
    );
};

export default LogoutForm;