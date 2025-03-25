import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import Modal from './Modal';
import { useAuth } from '../redux/auth/authHooks';

const Layout = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const handleAuthSuccess = () => {
        setShowLogin(false);
        setShowRegister(false);
        navigate('/');
    };

    return (
        <div className="layout-container">
            <Navbar
                onLoginClick={() => setShowLogin(true)}
                onRegisterClick={() => setShowRegister(true)}
                isAuthenticated={isAuthenticated}
            />

            <Modal isOpen={showLogin} onClose={() => setShowLogin(false)}>
                <LoginForm onSuccess={handleAuthSuccess} />
                <div className="auth-switch">
                    <button
                        onClick={() => {
                            setShowLogin(false);
                            setShowRegister(true);
                        }}
                        className="switch-button"
                    >
                        Need an account? Register
                    </button>
                </div>
            </Modal>

            <Modal isOpen={showRegister} onClose={() => setShowRegister(false)}>
                <RegisterForm onSuccess={handleAuthSuccess} />
                <div className="auth-switch">
                    <button
                        onClick={() => {
                            setShowRegister(false);
                            setShowLogin(true);
                        }}
                        className="switch-button"
                    >
                        Already have an account? Login
                    </button>

                </div>
            </Modal>
        </div>
    );
};

export default Layout;
