
// FIX: The original attempt to define types for `import.meta.env` created local interfaces
// that did not augment the global `ImportMeta` type, leading to "Property 'env' does not exist" errors.
// By using `declare global`, we correctly augment the global type definition for `ImportMeta`,
// making `import.meta.env` and its properties available to TypeScript throughout the module.
declare global {
  interface ImportMeta {
    readonly env: {
      readonly VITE_FIREBASE_API_KEY: string;
      readonly VITE_FIREBASE_AUTH_DOMAIN: string;
      readonly VITE_FIREBASE_PROJECT_ID: string;
      readonly VITE_FIREBASE_STORAGE_BUCKET: string;
      readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
      readonly VITE_FIREBASE_APP_ID: string;
    }
  }
}

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration is now securely loaded from environment variables
// Make sure to configure these in your Vercel project settings.
// See .env.example for a list of required variables.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Validate that all environment variables are present
for (const [key, value] of Object.entries(firebaseConfig)) {
  if (value === undefined) {
    throw new Error(`Missing Firebase config environment variable: VITE_FIREBASE_${key.toUpperCase()}`);
  }
}


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };