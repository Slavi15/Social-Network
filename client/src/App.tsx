import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      // { index: true, element: <HomePage /> },
      // { path: 'dashboard', element: <DashboardPage /> },
      // { path: 'profile', element: <ProfilePage /> },
      // { path: 'friends', element: <FriendsPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
