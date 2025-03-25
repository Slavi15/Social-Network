import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../../redux/auth/authApi';

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
            className={`logout-btn`}
        >
            Logout
        </button>
    );
};

export default LogoutForm;