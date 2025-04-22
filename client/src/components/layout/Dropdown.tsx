import { Link } from 'react-router';
import LogoutForm from '../auth/widgets/LogoutForm';
import { useAuth } from '../../redux/auth/authHooks';
import styles from '../../styles/components/Layout/Dropdown.module.scss';

const Dropdown = () => {
    const { user } = useAuth();
    
    return (
        <div className={styles.dropdownMenu}>
            <Link 
                to={`/profile/${user?.id}`} 
                className={styles.dropdownItem}
            >
                My Profile
            </Link>
            <div className={styles.dropdownItem}>
                <LogoutForm />
            </div>
        </div>
    );
};

export default Dropdown;