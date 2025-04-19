import { Link } from 'react-router-dom';
import { useAuth } from '../../redux/auth/authHooks';
import LogoutForm from '../auth/widgets/LogoutForm';
import styles from "../../styles/components/Navbar.module.scss";

interface NavbarProps {
    onLoginClick: () => void;
    onRegisterClick: () => void;
    isAuthenticated: boolean;
}

const Navbar = ({ onLoginClick, onRegisterClick, isAuthenticated }: NavbarProps) => {
    const { user } = useAuth();

    return (
        <nav className={styles.navbar}>
            <div className={styles.navbarContent}>
                <div className={styles.navbarLeft}>
                    <Link to="/" className={styles.navbarBrand}>
                        Social Network
                    </Link>

                    {isAuthenticated && (
                        <>
                            <Link to="/dashboard" className={styles.navbarLink}>
                                Dashboard
                            </Link>
                            <Link to="/profile" className={styles.navbarLink}>
                                Profile
                            </Link>
                            <Link to="/friends" className={styles.navbarLink}>
                                Friends
                            </Link>
                        </>
                    )}
                </div>

                <div className={styles.navbarRight}>
                    {isAuthenticated ? (
                        <>
                            <span className={styles.navbarWelcome}>Welcome, {user?.username}</span>
                            <LogoutForm />
                        </>
                    ) : (
                        <>
                            <button
                                onClick={onLoginClick}
                                className={styles.loginButton}
                            >
                                Login
                            </button>
                            <button
                                onClick={onRegisterClick}
                                className={styles.registerButton}
                            >
                                Register
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
