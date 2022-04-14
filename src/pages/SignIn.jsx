import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Firebase & Toastify
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';
// Icons
import visibilityIcon from '../assets/svg/visibilityIcon.svg';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
// Components
import OAuth from '../components/OAuth';

function SignIn() {
  const [showPwd, setShowPwd] = useState(false);

  // clear input values
  const [formData, setFormData] = useState({
    email: '',
    pwd: '',
  });

  const { email, pwd } = formData;
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // firebase: sign in user
    try {
      // 1. init auth middleware
      const auth = getAuth();

      // 2. sign in user
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        pwd
      );

      // 3. go home if user auth or log error
      if (userCredential.user) {
        navigate('/');
      }
    } catch (error) {
      // console.log(error);
      toast.error('Bad User Credentials');
    }
  };

  return (
    <>
      <div className='pg-container'>
        <header>
          <p className='pg-header'>Welcome Back!</p>
        </header>

        <form onSubmit={onSubmit}>
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

          <Link to='/forgot-pwd' className='forgot-pwd-link'>
            Forgot Password
          </Link>

          <div className='sign-in-bar'>
            <p className='sign-in-txt'>Sign In</p>
            <button className='sign-in-btn'>
              <ArrowRightIcon fill='#fff' width='34px' height='34px' />
            </button>
          </div>
        </form>

        <OAuth />

        <Link to='/sign-up' className='register-link'>
          Sign Up Instead
        </Link>
      </div>
    </>
  );
}

export default SignIn;

// NOTES:
// [e.target.id]: e.target.value
// do this to pass the value based on input id, 'email' or 'pwd'
//    email: john@email.com

// FIREBASE > DOCS > BUILD > AUTH > WEB
// https://firebase.google.com/docs/auth/web/start#sign_in_existing_users
