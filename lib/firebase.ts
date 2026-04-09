// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBCWZC4TgcRu0S7At4vNhHoSwqevmZMbn0",
  authDomain: "linknest-4d873.firebaseapp.com",
  projectId: "linknest-4d873",
  storageBucket: "linknest-4d873.firebasestorage.app",
  messagingSenderId: "687013669429",
  appId: "1:687013669429:web:bdc504199037d20945df7c",
  measurementId: "G-FLQXPVF2XM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Optional: Add custom parameters to the Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
