import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
// Pages
import Explore from './pages/Explore';
import Offers from './pages/Offers';
import Category from './pages/Category';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPwd from './pages/ForgotPwd';
import CreateListing from './pages/CreateListing';
import Listing from './pages/Listing';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Explore />} />
          <Route path='/offers' element={<Offers />} />
          <Route path='/profile' element={<PrivateRoute />}>
            <Route path='/profile' element={<Profile />} />
          </Route>
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/forgot-pwd' element={<ForgotPwd />} />
          <Route path='/create-listing' element={<CreateListing />} />
          <Route path='/category/:categoryName' element={<Category />} />
          <Route path='/category/:categoryName/:listingId' element={<Listing />} />
        </Routes>
        <Navbar />
      </Router>

      <ToastContainer />
    </>
  );
}

export default App;

// REACT TOASTIFY CONTAINER DEFAULT ATTRIBUTES
// <ToastContainer
//   position='top-right'
//   autoClose={5000}
//   hideProgressBar={false}
//   newestOnTop={false}
//   closeOnClick
//   rtl={false}
//   pauseOnFocusLoss
//   draggable
//   pauseOnHover
// />
