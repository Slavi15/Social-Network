import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from './redux/auth/authSlice';
import Feed from './components/posts/Feed';

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
				<Feed />
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
