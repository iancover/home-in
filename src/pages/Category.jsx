import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
 * @desc Fetch & display listings from Firebase by type: rent/sale
 * @public /category/:categoryName
 */
function Category() {
  // states: listing, spinner, fetch more listings & display count
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [listingsCountDisplay, setListingsCountDisplay] = useState(null);

  // to get listing type from URL
  const params = useParams();

  // Fetch initial listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        // ref collection
        const listingsRef = collection(db, 'listings');
        // build query w/limit
        const fetchLimit = 4;
        const q = query(
          listingsRef,
          where('type', '==', params.categoryName),
          orderBy('timestamp', 'desc'),
          limit(fetchLimit)
        );
        // query docs
        const querySnap = await getDocs(q);
        // array to map listings state into ListingItem
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
        // set states
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
  }, [params.categoryName]);

  // Fetch more listings on user action
  const onFetchMoreListings = async (e) => {
    try {
      // ref collection
      const listingsRef = collection(db, 'listings');
      // build query w/limit & starting from last
      const fetchLimit = 4;
      const q = query(
        listingsRef,
        where('type', '==', params.categoryName),
        orderBy('timestamp', 'desc'),
        startAt(lastFetchedListing),
        limit(fetchLimit)
      );
      // query docs
      const querySnap = await getDocs(q);

      // array to map listings state into ListingItem
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
      // scroll to Load More
      e.target.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      toast.error('Could not fetch more listings.', {
        theme: 'colored',
      });
    }
  };

  return (
    <div className='category-pg'>
      <header>
        <p className='pg-heading-1'>
          {params.categoryName === 'rent'
            ? 'Places for Rent'
            : 'Places for Sale'}
        </p>
      </header>

      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className='category-listings'>
              {listings.map((listing) => (
                <ListingItem
                  listing={listing.data}
                  id={listing.id}
                  key={listing.id}
                />
              ))}
            </ul>
          </main>
          <br />
          <br />
          {lastFetchedListing && (
            <p
              className='listings-load-more'
              onClick={(e) => onFetchMoreListings(e)}>
              Load More
            </p>
          )}
        </>
      ) : (
        <p>No listings for {params.categoryName}</p>
      )}
    </div>
  );
}

export default Category;
