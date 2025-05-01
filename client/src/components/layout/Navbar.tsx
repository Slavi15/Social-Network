import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../redux/auth/authHooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import Dropdown from './Dropdown.tsx';

import styles from "../../styles/components/Layout/Navbar.module.scss";
import ProfilePicture, { ImageSize } from '../profile/ProfilePicture';

const Navbar = () => {
    const { user } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className={styles.navbar}>
            <div className={styles.navbarContent}>
                <div className={styles.navbarLeft}>
                    <Link to="/" className={styles.navbarBrand}>
                        Social Network
                    </Link>
                </div>

                <div className={`${styles.links} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
                    <Link
                        to="/"
                        className={styles.navbarLink}
                        onClick={() => setIsMobileMenuOpen(false)}>
                        Feed
                    </Link>
                    <Link
                        to="/events"
                        className={styles.navbarLink}
                        onClick={() => setIsMobileMenuOpen(false)}>
                        Events
                    </Link>
                    <Link
                        to={`/chats/${user?._id as string}`}
                        className={styles.navbarLink}
                        onClick={() => setIsMobileMenuOpen(false)}>
                        Chats
                    </Link>
                    <Link
                        to="/friends"
                        className={styles.navbarLink}
                        onClick={() => setIsMobileMenuOpen(false)}>
                        Friends
                    </Link>
                </div>

                <div className={styles.navbarRight} ref={dropdownRef}>
                    <div className={styles.avatarContainer} onClick={toggleDropdown}>
                        <ProfilePicture
                            userId={user?._id as string}
                            username={user?.username as string}
                            profilePicture={user?.profile_picture as string}
                            size={ImageSize.SMALL}
                            linkToProfile={true} />
                        {isDropdownOpen && <Dropdown />}
                    </div>
                    <button
                        className={styles.mobileMenuButton}
                        onClick={toggleMobileMenu}
                        aria-label="Toggle menu"
                    >
                        <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
