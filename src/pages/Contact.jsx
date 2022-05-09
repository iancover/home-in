import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';

/**
 * @desc Message listing owner 'Landlord' with default email
 * @public /contact/:landlordId
 * @see Listing
 */
function Contact() {
  const [message, setMessage] = useState('');
  const [landlord, setLandlord] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();

  // to get listing owner 'landlord' id
  const params = useParams();

  // Fetch listing creator 'landlordId == listing.userRef'
  useEffect(() => {
    const getLandlord = async () => {
      const docRef = doc(db, 'users', params.landlordId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLandlord(docSnap.data());
      } else {
        toast.error('Could not get landlord data', {
          theme: 'colored',
        });
      }
    };

    getLandlord();
  }, [params.landlordId]);

  const onChange = (e) => setMessage(e.target.value);

  return (
    <div className='contact-pg'>
      <header>
        <p className='pg-heading-1'>Contact Landlord</p>
      </header>

      {landlord !== null && (
        <main>
          <p className='contact-landlord-name'>{landlord?.name}</p>

          <form className='contact-msg-form'>
            <div className='contact-msg-div'>
              <label htmlFor='message' className='contact-msg-label'>
                Message
              </label>
              <textarea
                name='message'
                id='message'
                value={message}
                className='textarea'
                rows={10}
                onChange={onChange}></textarea>
            </div>

            <a
              href={`mailto:${landlord.email}?Subject=${searchParams.get(
                'listingName'
              )}&body=${message}`}
              target='_blank'
              rel='noreferrer'>
              <button type='button' className='btn-primary'>
                Send Message
              </button>
            </a>
          </form>
        </main>
      )}
    </div>
  );
}

export default Contact;
