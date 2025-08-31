// Using Firebase Compat version
const firebaseConfig = {
  apiKey: "AIzaSyDhnrvGjy2UAzNwD0Q3cR-hxUbddxM2cks",
  authDomain: "cataloguenew-72ff8.firebaseapp.com",
  projectId: "cataloguenew-72ff8",
  storageBucket: "cataloguenew-72ff8.appspot.com",
  messagingSenderId: "830475889931",
  appId: "1:830475889931:web:4a631d6e1d43936ead060e"
};

// Initialize Firebase with compat version
firebase.initializeApp(firebaseConfig);

// Export Firebase services
export const db = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();
