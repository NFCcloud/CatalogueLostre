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
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Get Firebase service instances
const firestore = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

// Configure Firestore
firestore.settings({ experimentalForceLongPolling: true });

// Configure Storage
storage.setMaxUploadRetryTime(30000);
storage.setMaxOperationRetryTime(30000);

// Export Firebase services
export const db = firestore;
export { auth, storage };
