// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// import { getAnalytics, logEvent } from 'firebase/analytics';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBG3TtmWDyHiqlKrBrJU5uvPx1x4DJPLqM',
  authDomain: 'home-in-app.firebaseapp.com',
  projectId: 'home-in-app',
  storageBucket: 'home-in-app.appspot.com',
  messagingSenderId: '1053702713336',
  appId: '1:1053702713336:web:8439f7e3915f7454daf00d',
  measurementId: 'G-R772YK0MHF',
};

// Initialize Firebase
initializeApp(firebaseConfig);

// Google Analytics
// const app = initializeApp(firebaseConfig)
// const analytics = getAnalytics(app);
// logEvent(analytics, 'notification_received');

export const db = getFirestore();
