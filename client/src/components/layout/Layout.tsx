import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../redux/auth/authHooks';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
    children?: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    return (
        <div className="layout-container">
            <Navbar
                onLoginClick={() => navigate('/login')}
                onRegisterClick={() => navigate('/register')}
                isAuthenticated={isAuthenticated}
            />

            <main>{children}</main>

            <Footer />
        </div>
    );
};

export default Layout;
