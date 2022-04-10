import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

function Profile() {
  const [user, setUser] = useState({});
  const auth = getAuth();

  useEffect(() => {
    // to check current user
    // console.log(auth.currentUser);
    setUser(auth.currentUser);
  }, []);

  return user ? <h1>{user.displayName}</h1> : 'Not Logged In';
}

export default Profile;
