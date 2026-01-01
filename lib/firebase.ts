/**
 * Firebase Configuration
 * Client-side Firebase initialization for authentication
 */

import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate config
const isConfigured = Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId
);

if (!isConfigured && typeof window !== 'undefined') {
    console.warn('Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* env vars.');
}

// Initialize Firebase (singleton pattern for Next.js)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

// Use emulator in development (optional)
if (process.env.NODE_ENV === 'development' && process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    connectAuthEmulator(auth, `http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}`);
}

export { app, auth, isConfigured };
