import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// Firebase
import { getAuth, updateProfile } from 'firebase/auth';
import {
  doc,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase.config';
// Toastify
import { toast } from 'react-toastify';
// Icons
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg';
import homeIcon from '../assets/svg/homeIcon.svg';
// Components
import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';

/**
 * @desc User details, new listing & display created listings
 * @private /profile
 */
function Profile() {
  const auth = getAuth();
  // states: spinner, listings, user details & input data
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;

  // to redirect home
  const navigate = useNavigate();

  // Fetch listings from Firebase
  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        // ref db collection
        const listingsRef = collection(db, 'listings');
        // build query
        const q = query(
          listingsRef,
          where('userRef', '==', auth.currentUser.uid),
          orderBy('timestamp', 'desc')
        );
        // query docs
        const querySnap = await getDocs(q);
        // create array to map listings state into ListingItem
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        // set states
        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error('Could not fetch listings.', {
          theme: 'colored',
        });
      }
    };

    fetchUserListings();
  }, [auth.currentUser.uid]);

  // Logout & redirect home
  const onLogout = () => {
    auth.signOut();
    navigate('/sign-in');
  };

  // Update user in Firebase
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
      toast.error('Could not update profile details!', {
        theme: 'colored',
      });
    }
  };

  // Input typing display real-time
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  // Delete listing
  const onDelete = async (listingId) => {
    if (window.confirm('Are you sure you want to delete listing?')) {
      await deleteDoc(doc(db, 'listings', listingId));
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingId
      );
      setListings(updatedListings);
      toast.success('Deleted listing.', {
        theme: 'colored',
      });
    }
  };

  // Edit listing
  const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className='profile-pg'>
      <header className='profile-header'>
        <p className='pg-heading-1'>{name}</p>
        <button type='button' className='log-out' onClick={onLogout}>
          Logout
        </button>
      </header>

      <main>
        <div className='profile-details'>
          <p className='pg-heading-3'>Account Details</p>
          <p
            className='profile-change-details'
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails((prevState) => !prevState);
            }}>
            {changeDetails ? 'done' : 'change'}
          </p>
        </div>

        <div className='profile-card'>
          <form>
            <label htmlFor={name}>Name: </label>
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
            <label htmlFor={name}>Email: </label>
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

        {auth.currentUser.uid ===
          (process.env.REACT_APP_ADMIN_ID || process.env.REACT_APP_USER_ID) && (
          <Link to='/create-listing' className='create-listing-link'>
            <img src={homeIcon} alt='home' />
            <p>Sell or Rent your home</p>
            <img src={arrowRight} alt='arrow right' />
          </Link>
        )}

        {!loading && listings?.length > 0 && (
          <>
            <p className='listing-txt'>Your Listings</p>
            <ul className='profile-listings'>
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}

export default Profile;

/**
 * onClick
 * Toggles 'done' & 'change' text to display, e.g. if 'changeDetails' == true
 * onSubmit updates user name in Firebase and toggles to 'done'.
 */
