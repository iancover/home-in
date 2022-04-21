import { Link } from 'react-router-dom';
// Components
import Slider from '../components/Slider';
// Images
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg';
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg';

function Explore() {
  return (
    <div className='explore'>
      <header>
        <p className='pg-header'>Explore</p>
      </header>

      <main>
        <Slider />

        <p className='explore-cat-heading'>Categories</p>
        <div className='explore-cats'>
          <Link to='/category/rent'>
            <img src={rentCategoryImage} alt='rent' className='explore-cat-img' />
            <p className='explore-cat-name'>Places for Rent</p>
          </Link>
          <Link to='/category/sale'>
            <img src={sellCategoryImage} alt='sale' className='explore-cat-img' />
            <p className='explore-cat-name'>Places for Sale</p>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Explore;
