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

function SignUp() {
  const [showPwd, setShowPwd] = useState(false);

  // clear input values
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    pwd: '',
  });

  const { name, email, pwd } = formData;
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  // Create user w/email & pwd in Firebase & go home
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
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
      const formDataCopy = { ...formData };
      delete formDataCopy.pwd;
      formDataCopy.timestamp = serverTimestamp();
      await setDoc(doc(db, 'users', user.uid), formDataCopy);

      navigate('/');
    } catch (error) {
      // console.log(error);
      toast.error('Registration Error! Please Try Again');
    }
  };

  return (
    <>
      <div className='pg-container'>
        <header>
          <p className='pg-header'>Welcome</p>
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

        <OAuth />

        <Link to='/sign-in' className='register-link'>
          Sign In Instead
        </Link>
      </div>
    </>
  );
}

export default SignUp;

// NOTES
// onSubmit:
//  Create new user in Firebase with Email & Pwd
//  1. init auth middleware
//  2. create user w/email & pwd credentials
//  3. init 'user' obj
//  4. update profile name w/current auth user
//  5. create copy of user to add to db without pwd
//  6. log server timestamp & set doc to 'users' db collection w/uid
//  7. go home and/or log error
