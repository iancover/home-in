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

/**
 * @desc Auth existing user & redirect home
 * @public /sign-in
 * @see OAuth
 */
function SignIn() {
  // states: view pwd, input values
  const [showPwd, setShowPwd] = useState(false);
  const clearForm = {
    email: '',
    pwd: '',
  };
  const [formData, setFormData] = useState(clearForm);
  const { email, pwd } = formData;

  // to redirect home
  const navigate = useNavigate();

  // input typing display real-time
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  // Auth user with Firebase credentials & redirect home
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, pwd);
      if (userCredential.user) {
        navigate('/profile');
      }
    } catch (error) {
      setFormData(clearForm);
      toast.error('Enter valid email & password, or Sign Up.', {
        theme: 'colored',
      });
    }
  };

  return (
    <>
      <div className='sign-in-pg'>
        <header>
          <p className='pg-heading-1'>Welcome Back!</p>
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
        <OAuth />

        <p className='sign-instead-txt'>
          I don't have an account
          <button className='sign-instead-btn'>
            <Link to='/sign-up' className='sign-instead-link'>
              Sign Up
            </Link>{' '}
          </button>
        </p>
      </div>
    </>
  );
}

export default SignIn;
