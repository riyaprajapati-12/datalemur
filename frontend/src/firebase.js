// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4jG4oGY0JlD8-nMsJx-Av8mHHPacam18",
  authDomain: "datalemur-clone.firebaseapp.com",
  projectId: "datalemur-clone",
  storageBucket: "datalemur-clone.firebasestorage.app",
  messagingSenderId: "44025995782",
  appId: "1:44025995782:web:28b91cd6c5636491e49987",
  measurementId: "G-MQEJBRTKD5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);