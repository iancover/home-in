import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStatus } from '../hooks/useAuthStatus';
import Spinner from './Spinner';

const PrivateRoute = () => {
  const { loggedIn, checkStatus } = useAuthStatus();

  if (checkStatus) {
    return <Spinner />;
  }
  return loggedIn ? <Outlet /> : <Navigate to='/sign-in' />;
};

export default PrivateRoute;

// NOTES
  // Since we cant add a <PrivateRoute> component directly w React Router v6
  // to redirect an auth user to their profile instead of to sing in
  // we create and add the custom hook 'useAuthStatus()', which uses a
  // Firebase function to handle authentication when changing state.

  // So then, if logged in <Outlet> points to <Profile>, the nested route
  // or else <Navigate to='/sign-in' /> redirects the user to <SignIn>
  //
  // <Route path='/profile' element={<PrivateRoute />}>
  //   <Route path='/profile' element={<Profile />} />
  // </Route>
  // <Route path='/sign-in' element={<SignIn />} />
