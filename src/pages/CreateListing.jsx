import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// Firebase
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
// React-Toastify
import { toast } from 'react-toastify';
// Id
import { v4 as uuidv4 } from 'uuid';
// Components
import Spinner from '../components/Spinner';

/**
 * @desc Create listing in Firebase firestore using Geolocation API and store imgs & URLs
 * @public /create-listing
 * @see Profile
 */
function CreateListing() {
  // states: Geocoding API request, spinner, form data
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: '',
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
  });
  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    offer,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
  } = formData;

  // init Firebase auth
  const auth = getAuth();

  console.log(auth);

  // to redirect to sign in
  const navigate = useNavigate();

  // Auth user before mounting component
  const isMounted = useRef(true);
  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
        } else {
          navigate('/sign-in');
        }
      });
    }
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  // Form submit
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // price check
    if (discountedPrice >= regularPrice) {
      setLoading(false);
      toast.error('Discounted price needs to be less than regular price', {
        theme: 'colored',
      });
      return;
    }
    // max upload
    if (images.length > 6) {
      setLoading(false);
      toast.error('Max 6 images', {
        theme: 'colored',
      });
      return;
    }
    // Geocoding API request
    let geolocation = {};
    let location;
    const geocodeURL = 'https://maps.googleapis.com/maps/api/geocode/json';

    // *** ONLY ADMIN & USER CAN USE GEOCODE API
    if (geolocationEnabled) {
      if (
        auth.currentUser.uid === process.env.REACT_APP_ADMIN_ID ||
        process.env.REACT_APP_USER_ID
      ) {
        const response = await fetch(
          `${geocodeURL}?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
        );
        const data = await response.json();
        geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
        geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;
        //  'optional chaining ?' operator on 'results[0]?.geometry..' to avoid error
        //  'nullish coalescing ??' operator to return '0' if lat/lng = null/undefined

        location =
          data.status === 'ZERO_RESULTS'
            ? undefined
            : data.results[0]?.formatted_address;

        if (location === undefined || location.includes('undefined')) {
          setLoading(false);
          toast.error('Please enter correct address format.', {
            theme: 'colored',
          });
          return;
        }
      } else {
        setGeolocationEnabled(false);
        geolocation.lat = latitude;
        geolocation.lng = longitude;
      }
    }

    // Store image in Firebase & return URL
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();

        // unique img file names & storage ref
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, 'images/' + fileName);

        // (optional) log upload progress
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
              default:
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    // Run storeImage() on each img file & return array of URLs
    const imageUrls = await Promise.all(
      [...images].map((image) => {
        return storeImage(image);
      })
    ).catch(() => {
      setLoading(false);
      toast.error('Images not uploaded', {
        theme: 'colored',
      });
      return;
    });

    // data to submit and save to DB
    const formDataCopy = {
      ...formData,
      imageUrls,
      geolocation,
      timestamp: serverTimestamp(),
    };

    formDataCopy.location = address;
    delete formDataCopy.images;
    delete formDataCopy.address;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;

    // save to db collection and go to listing
    const docRef = await addDoc(collection(db, 'listings'), formDataCopy);
    setLoading(false);
    toast.success('Listing saved', {
      theme: 'colored',
    });
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  };

  // get input value
  const onMutate = (e) => {
    let boolean = null;

    // buttons
    if (e.target.value === 'true') boolean = true;
    if (e.target.value === 'false') boolean = false;

    // files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }
    // text/booleans/numbers
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className='create-listing-pg'>
      <header>
        <p className='pg-heading-1'>Create a Listing</p>
      </header>
      <main>
        <form onSubmit={onSubmit}>
          <label className='form-label'>Listing Type</label>
          <div className='form-btns'>
            <button
              className={type === 'sale' ? 'form-btn-active' : 'form-btn'}
              type='button'
              id='type'
              value='sale'
              onClick={onMutate}>
              Sell
            </button>
            <button
              className={type === 'rent' ? 'form-btn-active' : 'form-btn'}
              type='button'
              id='type'
              value='rent'
              onClick={onMutate}>
              Rent
            </button>
          </div>

          <label className='form-label'>Listing Title Display</label>
          <input
            className='form-input-name'
            type='text'
            id='name'
            value={name}
            onChange={onMutate}
            maxLength='32'
            minLength='10'
            placeholder='e.g. "Modern Garden Home"'
            required
          />

          <div className='form-rooms'>
            <div className='flex'>
              <input
                className='form-input-small'
                type='number'
                id='bedrooms'
                value={bedrooms}
                onChange={onMutate}
                min='1'
                max='20'
                required
              />
              <label className='form-label'>Bedrooms</label>
            </div>
            <div className='flex'>
              <input
                className='form-input-small'
                type='number'
                id='bathrooms'
                value={bathrooms}
                onChange={onMutate}
                min='1'
                max='20'
                required
              />
              <label className='form-label'>Bathrooms</label>
            </div>
          </div>

          <label className='form-label'>Parking Available</label>
          <div className='form-btns'>
            <button
              className={parking ? 'form-btn-active' : 'form-btn'}
              type='button'
              id='parking'
              value={true}
              onClick={onMutate}
              min='1'
              max='50'>
              Yes
            </button>
            <button
              className={
                !parking && parking !== null ? 'form-btn-active' : 'form-btn'
              }
              type='button'
              id='parking'
              value={false}
              onClick={onMutate}>
              No
            </button>
          </div>

          <label className='form-label'>Furnished</label>
          <div className='form-btns'>
            <button
              className={furnished ? 'form-btn-active' : 'form-btn'}
              type='button'
              id='furnished'
              value={true}
              onClick={onMutate}>
              Yes
            </button>
            <button
              className={
                !furnished && furnished !== null
                  ? 'form-btn-active'
                  : 'form-btn'
              }
              type='button'
              id='furnished'
              value={false}
              onClick={onMutate}>
              No
            </button>
          </div>

          <label className='form-label'>Address</label>
          <textarea
            className='form-input-address'
            type='text'
            id='address'
            value={address}
            onChange={onMutate}
            placeholder='street , city , st zip'
            required
          />
          <small className='sub-input-info'>
            &emsp; Street, City, State comma separated.
          </small>

          {!geolocationEnabled && (
            <div className='form-lat-lng flex'>
              <div>
                <label className='form-label'>Latitude</label>
                <input
                  className='form-input-small'
                  type='number'
                  id='latitude'
                  value={latitude}
                  onChange={onMutate}
                  required
                />
              </div>
              <div>
                <label className='form-label'>Longitude</label>
                <input
                  className='form-input-small'
                  type='number'
                  id='longitude'
                  value={longitude}
                  onChange={onMutate}
                  required
                />
              </div>
            </div>
          )}

          <label className='form-label'>Offer</label>
          <div className='form-btns'>
            <button
              className={offer ? 'form-btn-active' : 'form-btn'}
              type='button'
              id='offer'
              value={true}
              onClick={onMutate}>
              Yes
            </button>
            <button
              className={
                !offer && offer !== null ? 'form-btn-active' : 'form-btn'
              }
              type='button'
              id='offer'
              value={false}
              onClick={onMutate}>
              No
            </button>
          </div>

          <label className='form-label'>Regular Price</label>
          <div className='form-price-div'>
            <input
              className='form-input-small'
              type='number'
              id='regularPrice'
              value={regularPrice}
              onChange={onMutate}
              min='100'
              max='750000000'
              required
            />
            {type === 'rent' && <p className='form-price-txt'>$ / Month</p>}
          </div>

          {offer && (
            <>
              <label className='form-label'>Discounted Price</label>
              <input
                className='form-input-small'
                type='number'
                id='discountedPrice'
                value={discountedPrice}
                onChange={onMutate}
                min='50'
                max='750000000'
                required={offer}
              />
            </>
          )}

          <label className='form-label'>Images</label>
          <input
            className='form-input-file'
            type='file'
            id='images'
            onChange={onMutate}
            max='6'
            accept='.jpg,.png,.jpeg'
            multiple
            required
          />
          <small className='sub-input-info'>
            &emsp;Max 6 images, listing cover will be first image.
          </small>

          <button type='submit' className='btn-primary create-edit-listing-btn'>
            Create Listing
          </button>
        </form>
      </main>
    </div>
  );
}

export default CreateListing;
