import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const loggedIn = false;

  return loggedIn ? <Outlet /> : <Navigate to='/sign-in' />;
};

export default PrivateRoute;
