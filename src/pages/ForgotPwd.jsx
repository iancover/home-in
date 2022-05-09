import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// Firebase & Toastify
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-toastify';
// Icons
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';

/**
 * @desc Enter email to send Firebase pwd reset form
 * @public /forgot-pwd
 * @see SignIn
 */
function ForgotPwd() {
  // state: email
  const [email, setEmail] = useState('');
  // to redirect to sign in
  const navigate = useNavigate();
  // input data display real-time
  const onChange = (e) => setEmail(e.target.value);
  // email Firebase pwd reset form
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success('Email was sent', {
        theme: 'colored',
      });
      navigate('/sign-in');
    } catch (error) {
      toast.error('Could not send reset email', {
        theme: 'colored',
      });
    }
  };

  return (
    <div className='pg-container'>
      <header>
        <p className='pg-heading-1'>Forgot Password</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <input
            type='email'
            className='email-input'
            id='email'
            value={email}
            placeholder='Email'
            onChange={onChange}
          />
          <Link className='forgot-pwd-link' to='/sign-in'>
            Sign In
          </Link>

          <div className='sign-in-bar'>
            <div className='sign-in-txt'>Send Reset Link</div>
            <button className='sign-in-btn'>
              <ArrowRightIcon fill='#fff' width='34px' height='34px' />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default ForgotPwd;
