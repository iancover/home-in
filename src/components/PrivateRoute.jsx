import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStatus } from '../hooks/useAuthStatus';
import Spinner from './Spinner';

/**
 * @desc Run custom hook to auth user & handle redirect
 * @public /profile
 */
const PrivateRoute = () => {
  // custom hook auth
  const { loggedIn, checkStatus } = useAuthStatus();
  if (checkStatus) {
    return <Spinner />;
  }
  return loggedIn ? <Outlet /> : <Navigate to='/sign-in' />;
};

export default PrivateRoute;

/**
 * NOTES:
 * With React Router v6, must nest <Profile> inside <PrivateRoute>
 * can't route directly to a private route.
 * Create and add custom hook 'useAuthStatus()', which uses
 * Firebase middleware to handle authentication when changing state
 * when user visits /profile page.
 * So, if logged in <Outlet> redirects to nested <Profile>
 * else redirect so <SignIn> with <Navigate to='/sign-in' /
 */
