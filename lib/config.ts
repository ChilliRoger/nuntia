/**
 * Environment Configuration
 * Validates and exports environment variables with type safety
 */

// Ollama Configuration
export const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
export const OLLAMA_DEFAULT_MODEL = process.env.OLLAMA_MODEL || 'llama3.2:1b';

// Database Configuration
export const DATABASE_URL = process.env.DATABASE_URL || 'sqlite.db';

// Future: Firebase Configuration (for email auth)
export const FIREBASE_CONFIG = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase is configured
export const isFirebaseConfigured = Boolean(
    FIREBASE_CONFIG.apiKey &&
    FIREBASE_CONFIG.authDomain &&
    FIREBASE_CONFIG.projectId
);

// Application Settings
export const APP_CONFIG = {
    name: 'Nuntia',
    version: '0.1.0',
    description: 'AI-Powered RSS Intelligence',

    // Feed refresh interval (15 minutes)
    revalidateInterval: 900,

    // Maximum stories to fetch per feed
    maxStoriesPerFeed: 50,

    // Digest settings
    digestStoryLimit: 20,
    digestTimeWindowHours: 24,
};
