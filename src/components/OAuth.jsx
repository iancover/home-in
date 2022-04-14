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

function OAuth() {
  const navigate = useNavigate();
  const location = useLocation();

  const onGoogleClick = async () => {
    try {
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

// NOTES:
//  onGoogleClick:
//    1. init Firebase auth
//    2. init Google provider
//    3. init sign in popup
//    4. & make resulting user the 'user'
//    5. ref the db -> users collection for user
//    6. pass to a doc snapshot
//    7. check if user exists, if not create it & timestamp it
//    8. navigate home & log error
