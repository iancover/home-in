import { Link } from 'react-router-dom';
import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg';
import bedIcon from '../assets/svg/bedIcon.svg';
import bathtubIcon from '../assets/svg/bathtubIcon.svg';

function ListingItem({ listing, id, onDelete }) {
  return (
    <li>
      <div className='cat-listing'>
        <div className='cat-listing'>
          <Link to={`/category/${listing.type}/${id}`} className='cat-listing-link'>
            <img src={listing.imageUrls[0]} alt={listing.name} className='cat-listing-img' />
            <div className='cat-listing-details'>
              <p className='cat-listing-location'>
                {listing.location.match(/([A-Z][a-z]+\s?)+,\s[A-Z]{2}/g).toString()}
              </p>
              <p className='cat-listing-name'>{listing.name}</p>
              <p className='cat-listing-price'>
                ${' '}
                {listing.offer
                  ? listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                {listing.type === 'rent' && ' / Month'}
              </p>
              <div className='cat-listing-info-div'>
                <img src={bedIcon} alt='bed' />
                <p className='cat-listing-info-txt'>
                  {listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : '1 Bedroom'}
                </p>
                <img src={bathtubIcon} alt='bath' />
                <p className='cat-listing-info-txt'>
                  {listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : '1 Bathroom'}
                </p>
              </div>
            </div>
          </Link>
        </div>
        <div className='flex'>
          {onDelete && (
            <DeleteIcon
              className='delete-icon'
              fill='rgb(194, 110, 101)'
              onClick={() => onDelete(listing.id, listing.name)}
            />
          )}
        </div>
      </div>
    </li>
  );
}

export default ListingItem;
