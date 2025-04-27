import LogoutForm from '../auth/widgets/LogoutForm';
import styles from '../../styles/components/Layout/Dropdown.module.scss';

const Dropdown = () => {
    return (
        <div className={styles.dropdownMenu}>
            <div className={styles.dropdownItem}>
                <LogoutForm />
            </div>
        </div>
    );
};

export default Dropdown;