/**
 * @desc Displays on 'setLoading(true)'
 * @see PrivateRoute
 * @see Slider
 * @see Category
 * @see CreateListing
 * @see EditListing
 * @see Listing
 * @see Offers
 * @see Profile
 */
function Spinner() {
  return (
    <div className='loading-spinner-container'>
      <div className='loading-spinner'></div>
    </div>
  );
}

export default Spinner;
