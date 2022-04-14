import { Link } from 'react-router-dom';
import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg';
import bedIcon from '../assets/svg/bedIcon.svg';
import bathtubIcon from '../assets/svg/bathtubIcon.svg';

function ListingItem({ listing, id, onDelete }) {
  return (
    <li className='cat-listing'>
      <Link
        to={`/category/${listing.type}/${id}`}
        className='cat-listing-link'>
        <img
          src={listing.imageUrls[0]}
          alt={listing.name}
          className='cat-listing-img'
        />
        <div className='cat-listing-details'>
          <p className='cat-listing-location'>{listing.location}</p>
          <p className='cat-listing-name'>{listing.name}</p>
          <p className='cat-listing-price'>
            ${' '}
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            {listing.type === 'rent' && ' / Month'}
          </p>
          <div className='cat-listing-info-div'>
            <img src={bedIcon} alt='bed' />
            <p className='cat-listing-info-txt'>
              {listing.bedrooms > 1
                ? `${listing.bedrooms} Bedrooms`
                : '1 Bedroom'}
            </p>
            <img src={bathtubIcon} alt='bath' />
            <p className='cat-listing-info-txt'>
              {listing.bathrooms > 1
                ? `${listing.bathrooms} Bathrooms`
                : '1 Bathroom'}
            </p>
          </div>
        </div>
      </Link>
      {onDelete && (
        <DeleteIcon
          className='remove-icon'
          fill='rgb(231, 76, 60)'
          onClick={() => onDelete(listing.id, listing.name)}
        />
      )}
    </li>
  );
}

export default ListingItem;
