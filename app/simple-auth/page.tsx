'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SimpleAuthPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        // Check for redirect result on page load
        checkRedirectResult();
    }, []);

    async function checkRedirectResult() {
        try {
            const { initializeApp, getApps } = await import('firebase/app');
            const { getAuth, getRedirectResult } = await import('firebase/auth');

            const firebaseConfig = {
                apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
                authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
                messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
                appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
            };

            const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
            const auth = getAuth(app);

            const result = await getRedirectResult(auth);
            if (result?.user) {
                console.log('✅ Signed in:', result.user.email);
                setStatus('success');
                setMessage(`Welcome ${result.user.displayName || result.user.email}!`);
                setTimeout(() => router.push('/'), 2000);
            }
        } catch (error: any) {
            console.error('Redirect result error:', error);
            if (error.code) {
                setStatus('error');
                setMessage(`Error: ${error.code}`);
            }
        }
    }

    async function handleGoogleSignIn() {
        setStatus('loading');
        setMessage('Initiating Google Sign-In...');

        try {
            // Dynamically import Firebase
            const { initializeApp, getApps } = await import('firebase/app');
            const { getAuth, GoogleAuthProvider, signInWithRedirect } = await import('firebase/auth');

            console.log('📦 Loading Firebase...');

            const firebaseConfig = {
                apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
                authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
                messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
                appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
            };

            // Validate config
            if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
                throw new Error('Firebase not configured. Missing environment variables.');
            }

            console.log('✅ Firebase config validated');
            console.log('🔑 API Key:', firebaseConfig.apiKey.substring(0, 10) + '...');
            console.log('🌐 Auth Domain:', firebaseConfig.authDomain);
            console.log('📂 Project ID:', firebaseConfig.projectId);

            // Initialize Firebase
            const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
            const auth = getAuth(app);

            console.log('✅ Firebase initialized');
            console.log('📍 Current domain:', window.location.hostname);

            // Create Google provider
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({
                prompt: 'select_account'
            });

            console.log('✅ Google provider created');
            console.log('🚀 Initiating redirect to Google...');

            setMessage('Redirecting to Google for sign-in...');

            // Use redirect (most reliable)
            await signInWithRedirect(auth, provider);

            // This line won't execute because of redirect
            console.log('After redirect call (should not see this)');

        } catch (error: any) {
            console.error('❌ Error:', error);
            setStatus('error');
            
            let errorMsg = 'An error occurred. ';
            
            if (error.code === 'auth/unauthorized-domain') {
                errorMsg = `Domain "${window.location.hostname}" not authorized in Firebase. Add it in Firebase Console → Authentication → Settings → Authorized domains`;
            } else if (error.code === 'auth/operation-not-allowed') {
                errorMsg = 'Google Sign-In not enabled. Enable it in Firebase Console → Authentication → Sign-in method';
            } else if (error.message?.includes('not configured')) {
                errorMsg = 'Firebase not configured. Check environment variables at /diagnostics';
            } else {
                errorMsg = `Error: ${error.code || error.message}`;
            }
            
            setMessage(errorMsg);
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            padding: '20px'
        }}>
            <div style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '48px',
                maxWidth: '440px',
                width: '100%',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 style={{ 
                        fontSize: '32px', 
                        fontWeight: 'bold', 
                        margin: '0 0 8px 0',
                        color: '#1a1a1a'
                    }}>
                        Welcome to Nuntia
                    </h1>
                    <p style={{ 
                        color: '#666', 
                        margin: 0,
                        fontSize: '16px'
                    }}>
                        Sign in with your Google account
                    </p>
                </div>

                <button
                    onClick={handleGoogleSignIn}
                    disabled={status === 'loading'}
                    style={{
                        width: '100%',
                        padding: '16px',
                        fontSize: '16px',
                        background: status === 'loading' ? '#ccc' : '#fff',
                        color: '#1a1a1a',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        transition: 'all 0.2s',
                        boxShadow: status === 'loading' ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                        if (status !== 'loading') {
                            e.currentTarget.style.borderColor = '#4285F4';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(66, 133, 244, 0.3)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (status !== 'loading') {
                            e.currentTarget.style.borderColor = '#e0e0e0';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                        }
                    }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    {status === 'loading' ? 'Signing in...' : 'Continue with Google'}
                </button>

                {message && (
                    <div style={{
                        marginTop: '24px',
                        padding: '16px',
                        borderRadius: '8px',
                        background: status === 'success' ? '#d1fae5' : status === 'error' ? '#fee2e2' : '#e0f2fe',
                        border: `2px solid ${status === 'success' ? '#10b981' : status === 'error' ? '#ef4444' : '#3b82f6'}`,
                        color: status === 'success' ? '#065f46' : status === 'error' ? '#7f1d1d' : '#1e40af',
                        fontSize: '14px',
                        lineHeight: '1.5'
                    }}>
                        <strong>
                            {status === 'success' ? '✅ ' : status === 'error' ? '❌ ' : 'ℹ️ '}
                        </strong>
                        {message}
                    </div>
                )}

                <div style={{ 
                    marginTop: '32px', 
                    textAlign: 'center',
                    fontSize: '14px'
                }}>
                    <a 
                        href="/diagnostics" 
                        style={{ 
                            color: '#666', 
                            textDecoration: 'none',
                            borderBottom: '1px solid #ccc'
                        }}
                    >
                        Troubleshooting
                    </a>
                    {' • '}
                    <a 
                        href="/auth-test" 
                        style={{ 
                            color: '#666', 
                            textDecoration: 'none',
                            borderBottom: '1px solid #ccc'
                        }}
                    >
                        Test Lab
                    </a>
                    {' • '}
                    <a 
                        href="/" 
                        style={{ 
                            color: '#666', 
                            textDecoration: 'none',
                            borderBottom: '1px solid #ccc'
                        }}
                    >
                        Home
                    </a>
                </div>
            </div>
        </div>
    );
}
