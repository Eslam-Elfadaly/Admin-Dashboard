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
  apiKey: "AIzaSyDLk-ArWVXjtfZU0FZlKlawc1Fp5e-3BEk",
  authDomain: "e-commerce-app-f349b.firebaseapp.com",
  projectId: "e-commerce-app-f349b",
  storageBucket: "e-commerce-app-f349b.firebasestorage.app",
  messagingSenderId: "473583563600",
  appId: "1:473583563600:web:257e77ec084ffce4ec7255",
  measurementId: "G-R2611209J3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const provider = new GoogleAuthProvider();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

export { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged };   