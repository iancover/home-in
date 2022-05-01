import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Firebase & Toastify
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
// Icons
import visibilityIcon from '../assets/svg/visibilityIcon.svg';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
// Components
import OAuth from '../components/OAuth';


/**
 * @desc Create new user in Firebase w/credentials or Google OAuth
 * @public /sign-up
 * @see OAuth
 */
function SignUp() {
  // states: view pwd & input values
  const [showPwd, setShowPwd] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    pwd: '',
  });
  const { name, email, pwd } = formData;
  // 
  const navigate = useNavigate();

  // Input typing real-time display
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  // Create user w/Firebase auth & redirect home
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // auth user w/email & pwd encryption
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        pwd
      );
      const user = userCredential.user;
      updateProfile(auth.currentUser, {
        displayName: name,
      });
      // store user details without pwd
      const formDataCopy = { ...formData };
      delete formDataCopy.pwd;
      formDataCopy.timestamp = serverTimestamp();
      await setDoc(doc(db, 'users', user.uid), formDataCopy);
      
      // redirect home
      navigate('/');
    } catch (error) {
      toast.error('Registration Error! Please Try Again');
    }
  };

  return (
    <>
      <div className='pg-container'>
        <header>
          <p className='pg-heading-1'>Welcome</p>
        </header>

        <form onSubmit={onSubmit}>
          <input
            type='text'
            id='name'
            className='name-input'
            value={name}
            onChange={onChange}
            placeholder='Name'
          />

          <input
            type='email'
            id='email'
            className='email-input'
            value={email}
            onChange={onChange}
            placeholder='Email'
          />

          <div className='pwd-input-div'>
            <input
              type={showPwd ? 'text' : 'password'}
              id='pwd'
              className='pwd-input'
              value={pwd}
              onChange={onChange}
              placeholder='Password'
            />

            <img
              src={visibilityIcon}
              alt='show password'
              className={showPwd ? 'show-pwd' : 'hide-pwd'}
              onClick={() => setShowPwd((prevState) => !prevState)}
            />
          </div>

          <div className='sign-up-bar'>
            <p className='sign-up-txt'>Sign Up</p>
            <button className='sign-up-btn'>
              <ArrowRightIcon fill='#fff' width='34px' height='34px' />
            </button>
          </div>
        </form>

        {/* Google OAuth btn */}
        <OAuth />

        <Link to='/sign-in' className='register-link'>
          Sign In Instead
        </Link>
      </div>
    </>
  );
}

export default SignUp;

