import { useEffect, useState, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const useAuthStatus = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkStatus, setCheckStatus] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
      }
      setCheckStatus(false);
    });

    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);

  return { loggedIn, checkStatus };
};

// NOTES
// Custom hook which uses Firebase fn to handle auth state
// to be able to redirect auth user to <Profile>
// 'useEffect()'
// using 'useRef' hook with isMounted and returning it
// fixes memory leak error that happens on trying
// to update state on an unmounted component
// because of 'return () => {}' will unmount component 

// Protected Routes v6
// https://stackoverflow.com/questions/65505665/protected-route-with-firebase

// Fix Memory Leak Warning
// https://stackoverflow.com/questions/59780268/cleanup-memory-leaks-on-an-unmounted-component-in-react-hooks
