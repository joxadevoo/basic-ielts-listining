import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDedEMP7B4uIYFGYFJo2FfuqwwlmeGrW4I",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "inven-8588f.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "inven-8588f",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "inven-8588f.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "186511543097",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:186511543097:web:14c5189d074178ab7576e8",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-MT6DY8G1N6"
};

let app = null;
let db = null;
let auth = null;

if (firebaseConfig.apiKey) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (err) {
    console.error("Firebase initialization failed:", err);
  }
} else {
  console.warn("VITE_FIREBASE_API_KEY is missing. Firebase running in offline/uninitialized mode.");
}

export { app, db, auth };
