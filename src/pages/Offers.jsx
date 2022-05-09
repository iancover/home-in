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

/**
 * @desc Display all listings with discounted price 'listing.offer == true'
 * @public /offers
 */
function Offers() {
  // states
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);
  const [listingsCountDisplay, setListingsCountDisplay] = useState(null);

  // Fetch listings from Firebase
  useEffect(() => {
    const fetchListings = async () => {
      try {
        // listings ref
        const listingsRef = collection(db, 'listings');
        // build query
        const fetchLimit = 4;
        const q = query(
          listingsRef,
          where('offer', '==', true),
          orderBy('timestamp', 'desc'),
          limit(fetchLimit)
        );
        // query docs
        const querySnap = await getDocs(q);

        // listings array to pass as state into ListingItem
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
        toast.error('Could not fetch listings', {
          theme: 'colored',
        });
      }
    };

    fetchListings();
  }, []);

  // Fetch more listing on user action
  const onFetchMoreListings = async (e) => {
    try {
      // listings ref
      const listingsRef = collection(db, 'listings');
      // build query
      const fetchLimit = 4;
      const q = query(
        listingsRef,
        where('offer', '==', true),
        orderBy('timestamp', 'desc'),
        startAt(lastFetchedListing),
        limit(fetchLimit)
      );
      // query docs
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
      toast.error('Could not fetch more listings.', {
        theme: 'colored',
      });
    }
  };

  return (
    <div className='offers-pg'>
      <header>
        <p className='pg-heading-1'>Offers</p>
      </header>

      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <span className='listings-count'>
              <strong>{listingsCountDisplay && listingsCountDisplay}</strong>{' '}
              Listings
            </span>

            <ul className='offers-listings'>
              {listings.map((listing) => (
                <ListingItem
                  listing={listing.data}
                  id={listing.id}
                  key={listing.id}
                />
              ))}
            </ul>
            <br />
            {lastFetchedListing && (
              <p
                className='listings-load-more'
                onClick={(e) => onFetchMoreListings(e)}>
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
