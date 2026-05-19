/**
 * Firebase Configuration — CarKing
 *
 * Replace the placeholder values below with your actual Firebase project config.
 * Get these from: Firebase Console → Project Settings → Your Apps → SDK setup
 *
 * Steps to set up:
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a new project named "carking-app"
 * 3. Add a Web App and copy the config below
 * 4. Enable Authentication → Google + Phone providers
 * 5. Enable Firestore Database
 */

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "carking-app.firebaseapp.com",
  projectId: "carking-app",
  storageBucket: "carking-app.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
