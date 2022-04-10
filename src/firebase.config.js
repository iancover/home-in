import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBG3TtmWDyHiqlKrBrJU5uvPx1x4DJPLqM',
  authDomain: 'home-in-app.firebaseapp.com',
  projectId: 'home-in-app',
  storageBucket: 'home-in-app.appspot.com',
  messagingSenderId: '1053702713336',
  appId: '1:1053702713336:web:8439f7e3915f7454daf00d',
  measurementId: 'G-R772YK0MHF',
};

initializeApp(firebaseConfig);

export const db = getFirestore();

// STEPS:
// ---------
// 1. Import functions needed from their SDKs
//    'initializeApp' from 'app' SDK
//    'getFirestore' from 'firestore' SDK for database
// 
// 2. Your web app's Firebase configuration
//    For Firebase JS SDK v7.20.0 and later, measurementId is optional
// 
// 3. Initialize Firebaase
// 
// 4. Export 'getFirestore()'

// FOR GOOGLE ANALYTICS:
// --------------------------
// import { getAnalytics, logEvent } from 'firebase/analytics';
// 
// const app = initializeApp(firebaseConfig)
// const analytics = getAnalytics(app);
// logEvent(analytics, 'notification_received');

// OTHER FIREBASE PRODUCTS:
// --------------------------
// https://firebase.google.com/docs/web/setup#available-libraries