'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    User,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    sendPasswordResetEmail,
    updateProfile,
} from 'firebase/auth';
import { auth, isConfigured } from '@/lib/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    isConfigured: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, displayName?: string) => Promise<void>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isConfigured) {
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        setError(null);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
            const message = getFirebaseErrorMessage(err.code);
            setError(message);
            throw new Error(message);
        }
    };

    const signUp = async (email: string, password: string, displayName?: string) => {
        setError(null);
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            if (displayName) {
                await updateProfile(result.user, { displayName });
            }
        } catch (err: any) {
            const message = getFirebaseErrorMessage(err.code);
            setError(message);
            throw new Error(message);
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (err: any) {
            setError('Failed to sign out');
        }
    };

    const resetPassword = async (email: string) => {
        setError(null);
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (err: any) {
            const message = getFirebaseErrorMessage(err.code);
            setError(message);
            throw new Error(message);
        }
    };

    const clearError = () => setError(null);

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            error,
            isConfigured,
            signIn,
            signUp,
            signOut,
            resetPassword,
            clearError,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Human-readable error messages
function getFirebaseErrorMessage(code: string): string {
    switch (code) {
        case 'auth/email-already-in-use':
            return 'This email is already registered. Try signing in instead.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/operation-not-allowed':
            return 'Google Sign-In is not enabled. Please contact support.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters.';
        case 'auth/user-disabled':
            return 'This account has been disabled.';
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            return 'Invalid email or password.';
        case 'auth/too-many-requests':
            return 'Too many attempts. Please try again later.';
        case 'auth/popup-closed-by-user':
            return 'Sign-in cancelled. Please try again.';
        case 'auth/popup-blocked':
            return 'Popup blocked. Please allow popups for this site.';
        case 'auth/unauthorized-domain':
            return 'This domain is not authorized. Please contact support.';
        case 'auth/cancelled-popup-request':
            return 'Sign-in cancelled. Please try again.';
        case 'auth/internal-error':
            return 'Internal error. Please check your configuration.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your internet connection.';
        case 'auth/timeout':
            return 'Request timed out. Please try again.';
        case 'unknown':
        case 'undefined':
            return 'Configuration error. Please ensure Firebase is set up correctly. Check the diagnostics page.';
        default:
            if (!code || code === 'undefined') {
                return 'Authentication setup error. Please check environment variables at /diagnostics';
            }
            console.warn('Unhandled Firebase error code:', code);
            return `Authentication error (${code}). Please try again or check /diagnostics page.`;
    }
}
