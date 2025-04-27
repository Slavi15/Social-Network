import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from './redux/auth/authSlice';
import Feed from './components/posts/Feed';
import ProfilePage from './components/profile/ProfilePage';
import FriendsPage from './components/friends/FriendsPage';
import ChatsPage from './components/chats/ChatsPage';

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
		path: '/profile/:userId',
		element: (
			<AuthGuard>
				<ProfilePage />
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
	{
		path: '/friends',
		element: (
			<AuthGuard>
				<FriendsPage />
			</AuthGuard>
		),
	},
	{
		path: '/chats/:userId',
		element: (
			<AuthGuard>
				<ChatsPage />
			</AuthGuard>
		)
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
