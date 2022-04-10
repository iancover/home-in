import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';

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

    try {
      // firebase: get auth method
      const auth = getAuth();
      // firebase: sign in auth user async
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        pwd
      );

      // if user valid, navigate home
      if (userCredential.user) {
        navigate('/');
      }
    } catch (error) {
      console.log(error);
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

        {/* Google OAuth */}
        <Link to='/sign-up' className='register-link'>
          Sign Up Instead
        </Link>
      </div>
    </>
  );
}

export default SignIn;
