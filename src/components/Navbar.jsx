import { useNavigate, useLocation } from 'react-router-dom';
import { ReactComponent as OfferIcon } from '../assets/svg/localOfferIcon.svg';
import { ReactComponent as ExploreIcon } from '../assets/svg/exploreIcon.svg';
import { ReactComponent as PersonOutlineIcon } from '../assets/svg/personOutlineIcon.svg';


/**
 * @desc Bottom navigation to Explore, Offers and auth user Profile
 * @see Routes in /App.js
 */
function Navbar() {
  const navigate = useNavigate();

  // to highlight color of current route
  const location = useLocation();
  const pathMatchRoute = (route) => {
    if (route === location.pathname) {
      return true;
    }
  };

  return (
    <footer className='navbar'>
      <nav className='navbar-nav'>
        <ul className='nav-list-items'>
          <li className='nav-list-item' onClick={() => navigate('/')}>
            <ExploreIcon
              fill={pathMatchRoute('/') ? '#2c2c2c' : '#8f8f8f'}
              width='36px'
              height='36px'
            />
            <p
              className={
                pathMatchRoute('/')
                  ? 'nav-list-item-name-active'
                  : 'nav-list-item-name'
              }>
              Explore
            </p>
          </li>
          <li className='nav-list-item'>
            <OfferIcon
              fill={pathMatchRoute('/offers') ? '#2c2c2c' : '#8f8f8f'}
              width='36px'
              height='36px'
              onClick={() => navigate('/offers')}
            />
            <p
              className={
                pathMatchRoute('/offers')
                  ? 'nav-list-item-name-active'
                  : 'nav-list-item-name'
              }>
              Offers
            </p>
          </li>
          <li className='nav-list-item'>
            <PersonOutlineIcon
              fill={pathMatchRoute('/profile') ? '#2c2c2c' : '#8f8f8f'}
              width='36px'
              height='36px'
              onClick={() => navigate('/profile')}
            />
            <p
              className={
                pathMatchRoute('/profile')
                  ? 'nav-list-item-name-active'
                  : 'nav-list-item-name'
              }>
              Profile
            </p>
          </li>
        </ul>
      </nav>
    </footer>
  );
}

export default Navbar;
