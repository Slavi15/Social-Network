import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../../redux/auth/authApi';

const LogoutForm = () => {
    const [logout, { isLoading }] = useLogoutMutation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout().unwrap();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <button
            onClick={handleLogout}
            disabled={isLoading}
            className={`logout-btn ${isLoading ? 'loading' : ''}`}
        >
            {isLoading ? (
                <>
                    <span className="spinner" /> Logging out...
                </>
            ) : (
                'Logout'
            )}
        </button>
    );
};

export default LogoutForm;