import { Link } from 'react-router-dom';

function Explore() {

  return (
    <div>
      <h1>Explore</h1>
      <Link to='/sign-in'>
        Sign In
      </Link>
      <Link to='/sign-up'>
        Sign Up
      </Link>
    </div>
  );
}

export default Explore;
