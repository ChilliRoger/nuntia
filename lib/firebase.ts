/**
 * Firebase Configuration
 * Client-side Firebase initialization for authentication
 * Production-ready with comprehensive error handling
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Debug: Log config status (values hidden for security)
if (typeof window !== 'undefined') {
    console.log('🔍 Firebase Environment Check:', {
        apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : '❌ MISSING',
        authDomain: firebaseConfig.authDomain || '❌ MISSING',
        projectId: firebaseConfig.projectId || '❌ MISSING',
        storageBucket: firebaseConfig.storageBucket || '❌ MISSING',
        messagingSenderId: firebaseConfig.messagingSenderId || '❌ MISSING',
        appId: firebaseConfig.appId ? `${firebaseConfig.appId.substring(0, 15)}...` : '❌ MISSING',
    });
}

// Validate config
const isConfigured = Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId
);

if (typeof window !== 'undefined') {
    console.log('Firebase Configuration Status:', {
        apiKey: firebaseConfig.apiKey ? '✓ Set' : '✗ Missing',
        authDomain: firebaseConfig.authDomain ? '✓ Set' : '✗ Missing',
        projectId: firebaseConfig.projectId ? '✓ Set' : '✗ Missing',
        storageBucket: firebaseConfig.storageBucket ? '✓ Set' : '✗ Missing',
        messagingSenderId: firebaseConfig.messagingSenderId ? '✓ Set' : '✗ Missing',
        appId: firebaseConfig.appId ? '✓ Set' : '✗ Missing',
        isConfigured
    });
    
    if (!isConfigured) {
        console.error('Firebase is not fully configured. Add NEXT_PUBLIC_FIREBASE_* env vars.');
    }
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
