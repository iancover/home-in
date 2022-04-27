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

function Profile() {
  const auth = getAuth();
  // states: spinner, listings, details, form data
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  const navigate = useNavigate();

  // fetch listings from Firebase
  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        // build query
        const listingsRef = collection(db, 'listings');
        const q = query(
          listingsRef,
          where('userRef', '==', auth.currentUser.uid),
          orderBy('timestamp', 'desc')
        );
        // get listings data
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        // set state listings
        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error('Could not fetch listings.');
      }
    };

    fetchUserListings();
  }, [auth.currentUser.uid]);

  // logout & redirect home
  const onLogout = () => {
    auth.signOut();
    navigate('/');
  };

  // update user firebase & firestore
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

  // delete listing
  const onDelete = async (listingId) => {
    if (window.confirm('Are you sure you want to delete listing?')) {
      await deleteDoc(doc(db, 'listings', listingId));
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingId
      );
      setListings(updatedListings);
      toast.success('Deleted listing.');
    }
  };

  // edit listing
  const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`);

  if (loading) {
    return <Spinner />;
  }

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
          <img src={homeIcon} alt='home' />
          <p>Sell or Rent your home</p>
          <img src={arrowRight} alt='arrow right' />
        </Link>

        {!loading && listings?.length > 0 && (
          <>
            <p className='listing-txt'>Your Listings</p>
            <ul className='listings-list'>
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

// useEffect: fetch listings from firestore
// -  Build a listings reference to collection
// -  Build a query with listings ref specifying to only get
//    listings linked to 'userRef'
// -  Create array of listings passing id & data
// -  Set listings as state to send data to ListingItem
//    if 'listings' array > 0 display ListingItem
//
// changeDetails state:
// -  To toggle between 'done/change' to change user details
// -  To enable/disable inputs to type
//
// onChange:
// -  To update input text as user types
//
// onClick:
// -  Toggles the 'done/change' to change the user's details
// -  if 'changeDetails == true' runs 'onSubmit()' & toggles text to 'done'
//
// onSubmit:
// -  Sends input data to update the user's display name in Firestore
// -  'onChange' only updates session display name when user types
