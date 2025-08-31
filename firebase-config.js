// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-storage.js';

// Hardcoded Firebase config for static hosting
const firebaseConfig = {
  apiKey: "AIzaSyDhnrvGjy2UAzNwD0Q3cR-hxUbddxM2cks",
  authDomain: "cataloguenew-72ff8.firebaseapp.com",
  projectId: "cataloguenew-72ff8",
  storageBucket: "cataloguenew-72ff8.appspot.com",
  messagingSenderId: "830475889931",
  appId: "1:830475889931:web:4a631d6e1d43936ead060e"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
