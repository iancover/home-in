import { useLocation, useNavigate } from 'react-router-dom';
// Firebase & Toastify
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
// Icons
import googleIcon from '../assets/svg/googleIcon.svg';

/**
 * @desc Authentication using Google account
 * @see SignIn
 * @see SignUp
 */
function OAuth() {
  const navigate = useNavigate();
  const location = useLocation();

  // Google OAuth popup verify or create new user
  const onGoogleClick = async () => {
    if (location.pathname === '/sign-in') { // <- *** REMOVE TO ENABLE ***
      try {
        // verify Google OAuth user
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // TO DISABLE NEW USERS
        if (user.email !== process.env.REACT_APP_USER) { // <- *** REMOVE ***
          auth.logout();
        } else {
          // check if user doesnt exist, create in db in 'users' collection
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (!docSnap.exists()) {
            await setDoc(doc(db, 'users', user.uid), {
              name: user.displayName,
              email: user.email,
              timestamp: serverTimestamp(),
            });
          }
        }
        navigate('/profile');
      } catch (error) {
        toast.error('Could not authorize with Google');
      }
    } else {   // <- *** REMOVE TO ENABLE ***
      toast.error('Feature disabled');
    }
  };

  return (
    <div className='oauth-login-div'>
      <p className='oauth-login-txt'>
        or sign {location.pathname === '/sign-up' ? 'up' : 'in'} with
      </p>
      <button className='oauth-login-btn' onClick={onGoogleClick}>
        <img src={googleIcon} alt='google' className='oauth-login-img-icon' />
      </button>
    </div>
  );
}

export default OAuth;

/**
 * onGoogleClick
 * 1. init Firestore auth
 * 2. init Google Auth provider
 * 3. sign in using Google popup window to select gmail acct
 * 4. ref users db collection w/user id
 * 5. if user doesn't exist create w/Google credentials
 * 6. or navigate home
 */
