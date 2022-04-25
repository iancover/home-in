import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// Firebase
import { collection, getDocs, query, where, orderBy, limit, startAt } from 'firebase/firestore';
import { db } from '../firebase.config';
// Toastify
import { toast } from 'react-toastify';
// Components
import ListingItem from '../components/ListingItem';
import Spinner from '../components/Spinner';

function Category() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);

  // to pass listing type
  const params = useParams();

  // fetch listings from Firebase
  useEffect(() => {
    const fetchListings = async () => {
      try {
        // listings ref & query & get docs
        const listingsRef = collection(db, 'listings');
        const fetchLimit = 11;
        const displayLimit = fetchLimit - 1;
        const q = query(
          listingsRef,
          where('type', '==', params.categoryName),
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
        if (listings.length <= displayLimit) {
          console.log('All available listings fetched.');
          setLastFetchedListing(false);
        } else {
          setLastFetchedListing(querySnap.docs.pop());
          listings.pop();
        }

        // set listings state
        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error('Could not fetch listings');
      }
    };

    fetchListings();
  }, [params.categoryName]);

  // more listings from Firebase
  const onFetchMoreListings = async () => {
    try {
      // listings ref & query & get docs
      const listingsRef = collection(db, 'listings');
      const fetchLimit = 11;
      const displayLimit = fetchLimit - 1;
      const q = query(
        listingsRef,
        where('type', '==', params.categoryName),
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
      if (listings.length <= displayLimit) {
        console.log('Remaining listings fetched.');
        setLastFetchedListing(false);
      } else {
        // const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        // setLastFetchedListing(lastVisible);
        setLastFetchedListing(querySnap.docs.pop());
        listings.pop();
      }

      setListings((prevState) => [...prevState, ...listings]);
      setLoading(false);
    } catch (error) {
      toast.error('Could not fetch more listings.');
    }
  };

  return (
    <div className='category'>
      <header>
        <p className='pg-header'>
          {params.categoryName === 'rent' ? 'Places for Rent' : 'Places for Sale'}
        </p>
      </header>

      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className='cat-listings'>
              {listings.map((listing) => (
                <ListingItem listing={listing.data} id={listing.id} key={listing.id} />
              ))}
            </ul>
          </main>
          <br />
          <br />
          {lastFetchedListing && (
            <p className='load-more' onClick={onFetchMoreListings}>
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
