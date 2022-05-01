import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
// React Leaflet
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
// Swiper
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
// Firebase
import { doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase.config';
// Components
import Spinner from '../components/Spinner';
// Icons
import shareIcon from '../assets/svg/shareIcon.svg';
// Swiper: enable modules
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

/**
 * @desc Full listing info with image Slider & Map objects, and copy link & contact buttons
 * @public /category/:categoryName/:listingId
 * @see Slider
 * @see Contact
 * @see CreateListing 
 */
function Listing() {
  // states: listing data, spinner & copy link
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  // to get category type & listing Id
  const params = useParams();
  const navigate = useNavigate();
  const auth = getAuth();

  // Fetch listings from Firebase
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
      <Swiper
        style={{
          '--swiper-navigation-color': 'rgba(81, 205, 137, 0.9)',
          '--swiper-pagination-color': 'rgba(69, 180, 119, 0.9)',
        }}
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation={true}>
        {listing.imageUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className='swiper-slide-div'
              style={{
                background: `url(${listing.imageUrls[index]}) center no-repeat`,
                backgroundSize: 'cover',
              }}></div>
          </SwiperSlide>
        ))}
      </Swiper>

      <button type='button' className='back-btn' onClick={() => navigate(-1)}>
        Back
      </button>

      <div
        className='listing-copy-link'
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

      <div className='listing-pg'>
        <p className='listing-name'>{listing.name}</p>
        <a href='#map'>
          <p className='listing-address'>
            {listing.location
              .match(
                /(\w+\s[A-z]+\.?\s?)+(?=(,\s([A-z]+\s?)+,\s[A-Z]{2}\s\d{5}))/g
              )
              .toString()}
            <br />
            {listing.location
              .match(/([A-Z][a-z]+\s?)+,\s[A-Z]{2}\s\d{5}/g)
              .toString()}
          </p>
        </a>

        <p className='listing-price'>
          ${' '}
          {listing.offer
            ? listing.discountedPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            : listing.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </p>

        <p className='listing-type'>
          For {listing.type === 'rent' ? 'Rent' : 'Sale'}
        </p>

        {listing.offer && (
          <p className='listing-discount'>
            $
            {(listing.regularPrice - listing.discountedPrice)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
            discount
          </p>
        )}

        <div className='listing-info-list'>
          <div>
            <p className='listing-info-item'>
              <strong className='listing-info-item-dot'>&middot;</strong>{' '}
              {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : '1 Bed'}
            </p>
            <p className='listing-info-item'>
              <strong className='listing-info-item-dot'>&middot;</strong>{' '}
              {listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : '1 Bath'}
            </p>
          </div>

          <div>
            <p className='listing-info-item'>
              <strong className='listing-info-item-dot'>&middot;</strong>{' '}
              {listing.parking ? 'No Parking' : 'No Parking'}
            </p>
            <p className='listing-info-item'>
              <strong className='listing-info-item-dot'>&middot;</strong>{' '}
              {listing.furnished ? 'Unfurnished' : 'Unfurnished'}
            </p>
          </div>
        </div>

        <p className='listing-map-header'>Location</p>

        <div className='leaflet-container' id='map'>
          <MapContainer
            style={{ height: '100%', width: '100%' }}
            center={[listing.geolocation.lat, listing.geolocation.lng]}
            zoom={13}
            scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy;&nbsp;<a href="http://osm.org/copyright">OpenStreetMap</a>'
              url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
              className='tile-layer-bg'
            />
            <Marker
              position={[listing.geolocation.lat, listing.geolocation.lng]}>
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
