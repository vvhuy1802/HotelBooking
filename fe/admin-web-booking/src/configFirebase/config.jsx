// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAAuVfHdupHGMO2m4BfqSFBqmqUr3GGSWo",
  authDomain: "hotelbooking-eea2b.firebaseapp.com",
  projectId: "hotelbooking-eea2b",
  storageBucket: "hotelbooking-eea2b.appspot.com",
  messagingSenderId: "54427171719",
  appId: "1:54427171719:web:0887eea552e730cf843122",
  measurementId: "G-RFP2GP6EYB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
