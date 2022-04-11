import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const useAuthStatus = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkStatus, setCheckStatus] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
      }
      setCheckStatus(false);
    });
  });

  return { loggedIn, checkStatus };
};

// NOTES
// Since we cant include a <PrivateRoute> component directly, we build
// this 'custom hook' to use Firebase middleware to handle changing state
// if user is logged in, allowing an auth user to view Profile without
// being redirected to SignIn

// Protected Routes v6
// https://stackoverflow.com/questions/65505665/protected-route-with-firebase

// Fix Memory Leak Warning
// https://stackoverflow.com/questions/59780268/cleanup-memory-leaks-on-an-unmounted-component-in-react-hooks

