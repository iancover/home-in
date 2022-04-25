import { useEffect, useState } from 'react';
// Firebase
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAt,
} from 'firebase/firestore';
import { db } from '../firebase.config';
// Toastify
import { toast } from 'react-toastify';
// Components
import ListingItem from '../components/ListingItem';
import Spinner from '../components/Spinner';

function Offers() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);
  const [listingsCountDisplay, setListingsCountDisplay] = useState(null);

  // fetch offer listings from Firebase
  useEffect(() => {
    const fetchListings = async () => {
      try {
        // listings ref & query & get docs
        const listingsRef = collection(db, 'listings');
        const fetchLimit = 4;
        const q = query(
          listingsRef,
          where('offer', '==', true),
          orderBy('timestamp', 'desc'),
          limit(fetchLimit)
        );
        const querySnap = await getDocs(q);

        // listings array
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        // to load more listings
        if (listings.length <= fetchLimit - 1) {
          console.log('Fetched all available listings.');
          setLastFetchedListing(false);
        } else {
          setLastFetchedListing(querySnap.docs.pop());
          listings.pop();
        }

        // set listings state
        setListings(listings);
        setListingsCountDisplay(listings.length);
        setLoading(false);
      } catch (error) {
        toast.error('Could not fetch listings');
      }
    };

    fetchListings();
  }, []);

  // more offer listings from Firebase
  const onFetchMoreListings = async (e) => {
    try {
      // listings ref & query & get docs
      const listingsRef = collection(db, 'listings');
      const fetchLimit = 4;
      const q = query(
        listingsRef,
        where('offer', '==', true),
        orderBy('timestamp', 'desc'),
        startAt(lastFetchedListing),
        limit(fetchLimit)
      );
      const querySnap = await getDocs(q);

      // listings array & state to pass in ListingItem
      const listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      // to load more listings
      if (listings.length <= fetchLimit - 1) {
        console.log('Fetched all remaining listings.');
        setLastFetchedListing(false);
      } else {
        setLastFetchedListing(querySnap.docs.pop());
        listings.pop();
      }

      // set states
      setListings((prevState) => [...prevState, ...listings]);
      setListingsCountDisplay((prevState) => prevState + listings.length);
      setLoading(false);
      e.target.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      toast.error('Could not fetch more listings.');
    }
  };

  return (
    <div className='category'>
      <header>
        <p className='pg-header'>Offers</p>
      </header>

      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <span className='listings-displayed'>
              <strong>{listingsCountDisplay && listingsCountDisplay}</strong>{' '}
              Listings
            </span>

            <ul className='cat-listings'>
              {listings.map((listing) => (
                <ListingItem
                  listing={listing.data}
                  id={listing.id}
                  key={listing.id}
                />
              ))}
            </ul>
            <br />
            <br />
            {lastFetchedListing && (
              <p className='load-more' onClick={(e) => onFetchMoreListings(e)}>
                Load More
              </p>
            )}
          </main>
        </>
      ) : (
        <p>No current offers</p>
      )}
    </div>
  );
}

export default Offers;
