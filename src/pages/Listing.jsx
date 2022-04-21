import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
// Leaflet
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
// Firebase
import { doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase.config';
// Components
import Spinner from '../components/Spinner';
// Icons
import shareIcon from '../assets/svg/shareIcon.svg';

function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const params = useParams();
  const navigate = useNavigate();
  const auth = getAuth();

  // get data
  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    };

    fetchListing();
  }, [navigate, params.listingId]);

  // display loader
  if (loading) {
    return <Spinner />;
  }

  return (
    <main>
      {/* SLIDER */}
      <div
        className='share-icon-div'
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}>
        <img src={shareIcon} alt='copy link icon' />
      </div>

      {shareLinkCopied && <p className='link-copied'>Link Copied!</p>}

      <div className='listing-details'>
        <p className='listing-name'>
          {listing.name} - $
          {listing.offer
            ? listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </p>
        <p className='listing-location'>{listing.location}</p>
        <p className='listing-type'>For {listing.type === 'rent' ? 'Rent' : 'Sale'}</p>

        {listing.offer && (
          <p className='discount-price'>
            ${listing.regularPrice - listing.discountedPrice} discount
          </p>
        )}

        <ul className='listing-details-list'>
          <li>{listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : '1 Bedroom'}</li>
          <li>{listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : '1 Bathroom'}</li>
          <li>{listing.parking && 'Parking Spot'}</li>
          <li>{listing.furnished && 'Furnished'}</li>
        </ul>

        <p className='listing-location-title'>Location</p>

        <div className='leaflet-container'>
          <MapContainer
            style={{ height: '100%', width: '100%' }}
            center={[listing.geolocation.lat, listing.geolocation.lng]}
            zoom={13}
            scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
            />
            <Marker position={[listing.geolocation.lat, listing.geolocation.lng]}>
              <Popup>{listing.location}</Popup>
            </Marker>
          </MapContainer>
        </div>

        {auth.currentUser?.uid !== listing.userRef && (
          <Link
            to={`/contact/${listing.userRef}?listingName=${listing.name}`}
            className='btn-primary'>
            Contact Landlord
          </Link>
        )}
      </div>
    </main>
  );
}

export default Listing;

// NOTES:
// replace() to add comma in thousands $1,000, regex:
//    \B - not word boundary
//    (?=(\d{3})) - before three digits
//    +(?!\d) - and not before a single digit

// Fix Leaflet issues:
// https://stackoverflow.com/questions/67552020/how-to-fix-error-failed-to-compile-node-modules-react-leaflet-core-esm-pat
