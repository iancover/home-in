import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// firebase
import { getAuth, updateProfile } from 'firebase/auth';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.config';
// toastify
import { toast } from 'react-toastify';
// icons
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg';
import homeIcon from '../assets/svg/homeIcon.svg';

function Profile() {
  const auth = getAuth();

  // profile updated state
  const [changeDetails, setChangeDetails] = useState(false);

  // input data state
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;

  // logout & redirect home
  const navigate = useNavigate();
  const onLogout = () => {
    auth.signOut();
    navigate('/');
  };

  // update firebase & firestore
  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
          name,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error('Could not update profile details!');
    }
  };

  // update data on input typing
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <div className='profile'>
      <header className='profile-header'>
        <p className='pg-header'>{name}</p>
        <button type='button' className='log-out' onClick={onLogout}>
          Logout
        </button>
      </header>

      <main>
        <div className='profile-details-header'>
          <p className='profile-details-text'>Personal Details</p>
          <p
            className='change-personal-details'
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails((prevState) => !prevState);
            }}>
            {changeDetails ? 'done' : 'change'}
          </p>
        </div>

        <div className='profile-card'>
          <form>
            <input
              type='text'
              id='name'
              value={name}
              className={
                !changeDetails ? 'profile-name' : 'profile-name-active'
              }
              disabled={!changeDetails}
              onChange={onChange}
            />
            <input
              type='text'
              id='email'
              value={email}
              className={
                !changeDetails ? 'profile-email' : 'profile-email-active'
              }
              disabled={!changeDetails}
              onChange={onChange}
            />
          </form>
        </div>
        <Link to='/create-listing' className='create-listing'>
          <img src={homeIcon} alt="home" />
          <p>Sell or Rent your home</p>
          <img src={arrowRight} alt="arrow right" />
        </Link>
      </main>
    </div>
  );
}

export default Profile;

// onSubmit:
//    if 'auth.currentUser.displayName' doesn't match 'name',
//    which 'onChange' just updated in real time.
//    then update firebase name to display
//    and name stored in firestore db doc 
//    and handle error

// onClick:
//    clicking <p> if 'changeDetails' is true/false toggles 'change/done'
//    and enables inputs to update data details
//    if 'changeDetails' is false, fires 'onSubmit' and toggles 'done/change'
