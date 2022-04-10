import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, updateProfile } from 'firebase/auth';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';

function Profile() {
  const auth = getAuth();
  const [changeDetails, setChangeDetails] = useState(false);

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  const navigate = useNavigate();

  const onLogout = () => {
    auth.signOut();
    navigate('/');
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // update display name in firebase
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // update in firestore
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
      </main>
    </div>
  );
}

export default Profile;
