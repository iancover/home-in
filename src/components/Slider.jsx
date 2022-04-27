import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Firebase
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase.config';
// Swiper
import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
// Component
import Spinner from './Spinner';

// Swiper Modules Enable
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Autoplay]);

function Slider() {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      const listingsRef = collection(db, 'listings');
      const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5));
      const querySnap = await getDocs(q);

      let listings = [];

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings(listings);
      setLoading(false);
    };

    fetchListings();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  // dont display anything if no listings
  if (listings.length === 0) {
    return <></>;
  }

  return (
    <>
      <p className='explore-heading'>Recommended</p>

      <Swiper
        loop={true}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        speed={2500}
        slidesPerView={1}
        pagination={{ clickable: true }}>
        {listings.map(({ data, id }) => (
          <SwiperSlide
            key={id}
            onClick={() => navigate(`/category/${data.type}/${id}`)}>
            <div
              className='swiper-slide-div'
              style={{
                background: `url(${data.imageUrls[0]}) center no-repeat`,
                backgroundSize: 'cover',
              }}>
              <p className='swiper-slide-txt'>{data.name}</p>
              <p className='swiper-slide-price'>
                $
                {data.discountedPrice
                  ? data.discountedPrice
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  : data.regularPrice
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                {data.type === 'rent' && '/ month'}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}

export default Slider;
