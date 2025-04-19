import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './components/HomePage';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from './redux/auth/authSlice';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
	const token = useSelector(selectCurrentToken);
	return token ? <Layout>{children}</Layout> : <Navigate to="/login" replace />;
};

const UnauthGuard = ({ children }: { children: React.ReactNode }) => {
	const token = useSelector(selectCurrentToken);
	return !token ? children : <Navigate to="/" replace />;
};

const router = createBrowserRouter([
	{
		path: '/',
		element: (
			<AuthGuard>
				<HomePage />
			</AuthGuard>
		)
	},
	{
		path: '/login',
		element: (
			<UnauthGuard>
				<LoginPage />
			</UnauthGuard>
		),
	},
	{
		path: '/register',
		element: (
			<UnauthGuard>
				<RegisterPage />
			</UnauthGuard>
		),
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
