import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB4tzoY3rrWh36z5Sxd1dFE_hTpc1cliXI",
  authDomain: "admin-dashboard-113e3.firebaseapp.com",
  projectId: "admin-dashboard-113e3",
  storageBucket: "admin-dashboard-113e3.firebasestorage.app",
  messagingSenderId: "612652935418",
  appId: "1:612652935418:web:25327f9f5fbfc02ae60143",
  measurementId: "G-0GG81KKLZD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const provider = new GoogleAuthProvider();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

export { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged };   