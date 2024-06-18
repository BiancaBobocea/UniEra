// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBRGU7QFgFKB0XXC4HX1PN1JD59mtEO5yY",
  authDomain: "uniera-163ee.firebaseapp.com",
  projectId: "uniera-163ee",
  storageBucket: "uniera-163ee.appspot.com",
  messagingSenderId: "924529176532",
  appId: "1:924529176532:web:f1a0e4c0b416c30bd23041"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export const storage = getStorage(app);

export const environment = {
  production: false
};

