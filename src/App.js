import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
// Pages
import Explore from './pages/Explore';
import Category from './pages/Category';
import Offers from './pages/Offers';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPwd from './pages/ForgotPwd';
import CreateListing from './pages/CreateListing';
import EditListing from './pages/EditListing';
import Listing from './pages/Listing';
import Contact from './pages/Contact';

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
          <Route path='/edit-listing/:listingId' element={<EditListing />} />
          <Route path='/category/:categoryName' element={<Category />} />
          <Route
            path='/category/:categoryName/:listingId'
            element={<Listing />}
          />
          <Route path='/contact/:landlordId' element={<Contact />} />
        </Routes>
        <Navbar />
      </Router>

      <ToastContainer />
      {/* 
        Default Toastify Container
        <ToastContainer
          position='top-right'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      */}
    </>
  );
}

export default App;

