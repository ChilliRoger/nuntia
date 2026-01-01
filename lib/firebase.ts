/**
 * Firebase Configuration
 * Client-side Firebase initialization for authentication
 * Production-ready with comprehensive error handling
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth';

// Get config with fallbacks and validation
function getFirebaseConfig() {
    const config = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
    };

    // Debug logging
    if (typeof window !== 'undefined') {
        console.log('🔍 Firebase Config Check:', {
            apiKey: config.apiKey ? `${config.apiKey.substring(0, 10)}...` : '❌ MISSING',
            authDomain: config.authDomain || '❌ MISSING',
            projectId: config.projectId || '❌ MISSING',
            storageBucket: config.storageBucket || '❌ MISSING',
            messagingSenderId: config.messagingSenderId || '❌ MISSING',
            appId: config.appId ? `${config.appId.substring(0, 15)}...` : '❌ MISSING',
        });
    }

    return config;
}

const firebaseConfig = getFirebaseConfig();

// Validate config
const isConfigured = Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
);

if (typeof window !== 'undefined' && !isConfigured) {
    console.error('❌ Firebase NOT configured! Missing required environment variables.');
    console.error('Required: NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, NEXT_PUBLIC_FIREBASE_PROJECT_ID, NEXT_PUBLIC_FIREBASE_APP_ID');
}

// Initialize Firebase (singleton pattern for Next.js)
let app: FirebaseApp;
let auth: Auth;

try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);

    // Use emulator in development (optional)
    if (process.env.NODE_ENV === 'development' && process.env.FIREBASE_AUTH_EMULATOR_HOST) {
        connectAuthEmulator(auth, `http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}`);
    }

    if (typeof window !== 'undefined' && isConfigured) {
        console.log('✅ Firebase initialized successfully');
    }
} catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    throw error;
}

export { app, auth, isConfigured };
