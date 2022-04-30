import { useLocation, useNavigate } from 'react-router-dom';
// Firebase & Toastify
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
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
    try {
      // Sign in or verify existing user w/Firebase & Google OAuth
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate('/');
    } catch (error) {
      toast.error('Could not authorize with Google');
    }
  };

  return (
    <div className='social-login'>
      <p>Sign {location.pathname === '/sign-up' ? 'Up' : 'In'} with </p>
      <button className='social-icon-div' onClick={onGoogleClick}>
        <img src={googleIcon} alt='google' className='social-icon-img' />
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
