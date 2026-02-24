import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCIlWYb6S2ViVKs12jYPzbiFdYQit1KYCM",
  authDomain: "efips-smart-portal.firebaseapp.com",
  projectId: "efips-smart-portal",
  storageBucket: "efips-smart-portal.firebasestorage.app",
  messagingSenderId: "652876961902",
  appId: "1:652876961902:web:bfb2f4620ac519bad6ee7f"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
