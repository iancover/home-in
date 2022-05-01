import { Link } from 'react-router-dom';
// Components
import Slider from '../components/Slider';
// Images
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg';
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg';


/**
 * @desc Slider auto displaying Recommended listings & Categories 
 * @public /
 * @see Category
 */
function Explore() {
  return (
    <div className='explore-pg'>
      <header>
        <p className='pg-heading-1'>Explore</p>
      </header>

      <main>
        <Slider />
        <p className='pg-heading-2'>Categories</p>
        <div className='explore-categories-div'>
          <Link to='/category/rent'>
            <img
              src={rentCategoryImage}
              alt='rent'
              className='explore-categories-img'
            />
            <p className='pg-heading-4'>Places for Rent</p>
          </Link>
          <Link to='/category/sale'>
            <img
              src={sellCategoryImage}
              alt='sale'
              className='explore-categories-img'
            />
            <p className='pg-heading-4'>Places for Sale</p>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Explore;
