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

// Configure Storage with CORS settings
const storage = firebase.storage();
storage.setCustomAuthHeaders({
  'Access-Control-Allow-Origin': 'https://nfccloud.github.io',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type'
});

// Export Firebase services
export const db = firebase.firestore();
export const auth = firebase.auth();
export { storage };
