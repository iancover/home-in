import { useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';

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

  const onSubmit = async (e) => {
    e.preventDefault();

    // firebase: create new user
    try {
      // 1. init auth middleware
      const auth = getAuth();

      // 2. create user w/email & pwd credentials
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        pwd
      );

      // 3. init 'user' obj
      const user = userCredential.user;

      // 4. update profile name w/current auth user
      updateProfile(auth.currentUser, {
        displayName: name,
      });

      // 5. create copy of user to add to db without pwd
      const formDataCopy = { ...formData };
      delete formDataCopy.pwd;

      // 6. add server timestamp & set doc to 'users' db collection w/uid
      formDataCopy.timestamp = serverTimestamp();
      await setDoc(doc(db, 'users', user.uid), formDataCopy);

      // 7. go home and/or log error
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

        {/* Google OAuth */}
        <Link to='/sign-in' className='register-link'>
          Sign In Instead
        </Link>
      </div>
    </>
  );
}

export default SignUp;
