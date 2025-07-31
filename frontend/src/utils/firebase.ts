import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";

import { persistUser } from "./auth"; // adjust path as needed

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// Updated Auth helpers

export const loginWithGoogle = async () => {
  try {
    await signInWithPopup(auth, provider);

    // Just call persistUser without fetching token here
    await persistUser();
  } catch (error) {
    console.error("Login with Google failed:", error);
    throw error;
  }
};

export const logout = () => signOut(auth);

export const listenToAuth = (callback: (user: User | null) => void) =>
  onAuthStateChanged(auth, callback);
