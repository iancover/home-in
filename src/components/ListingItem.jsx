import { Link } from 'react-router-dom';
import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg';
import { ReactComponent as EditIcon } from '../assets/svg/editIcon.svg';
import bedIcon from '../assets/svg/bedIcon.svg';
import bathtubIcon from '../assets/svg/bathtubIcon.svg';


/**
 * @desc Display brief listing data to display list of listings
 * @see Category
 * @see Offers
 * @see Profile onEdit & onDelete available
 */
function ListingItem({ listing, id, onEdit, onDelete }) {
  return (
    <li className='list-item'>
      <div className='list-item-div'>
        <div className='list-item-div'>
          <Link
            to={`/category/${listing.type}/${id}`}
            className='list-item-link'>
            <div className='list-item-img-div'>
              <img
                src={listing.imageUrls[0]}
                alt={listing.name}
                className='list-item-img'
              />
            </div>
            <div className='list-item-details'>
              <p className='list-item-location'>
                {listing.location
                  .match(/([A-Z][a-z]+\s?)+,\s[A-Z]{2}/g)
                  .toString()}
              </p>
              <p className='list-item-name'>{listing.name}</p>
              <p className='list-item-price'>
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
              <div className='list-item-info-div'>
                <img src={bedIcon} alt='bed' />
                <p className='list-item-info'>
                  {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : '1 Bed'}
                </p>
                <img src={bathtubIcon} alt='bath' />
                <p className='list-item-info'>
                  {listing.bathrooms > 1
                    ? `${listing.bathrooms} Baths`
                    : '1 Bath'}
                </p>
              </div>
            </div>
          </Link>
        </div>
        <div className='flex'>
          {onDelete && (
            <DeleteIcon
              className='delete-icon'
              fill='rgb(50, 50, 50, .3)'
              onClick={() => onDelete(listing.id, listing.name)}
            />
          )}

          {onEdit && (
            <EditIcon
              className='edit-icon'
              fill='rgba(50, 50, 50, .3)'
              onClick={() => onEdit(id)}
            />
          )}
        </div>
      </div>
    </li>
  );
}

export default ListingItem;


