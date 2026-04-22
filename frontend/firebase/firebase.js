import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD9RSeXcAUhkq6Z_AWzy2iKj3GYZgxwhWQ",
  authDomain: "projecttdtt-de605.firebaseapp.com",
  projectId: "projecttdtt-de605",
  storageBucket: "projecttdtt-de605.firebasestorage.app",
  messagingSenderId: "155544973531",
  appId: "1:155544973531:web:f0e0fe07b4241f39f09cfe",
  measurementId: "G-1V8T8X7GMN",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
