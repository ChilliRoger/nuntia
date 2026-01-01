'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthTestPage() {
    const [logs, setLogs] = useState<string[]>([]);
    const [testing, setTesting] = useState(false);
    const [result, setResult] = useState<'success' | 'error' | null>(null);
    const router = useRouter();

    const addLog = (message: string) => {
        setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
        console.log(message);
    };

    useEffect(() => {
        addLog('Page loaded');
        addLog(`Domain: ${window.location.hostname}`);
        addLog(`Protocol: ${window.location.protocol}`);
        
        // Check environment variables
        const envVars = {
            NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
            NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        };

        Object.entries(envVars).forEach(([key, value]) => {
            addLog(`${key}: ${value ? '✅ Set' : '❌ MISSING'}`);
        });
    }, []);

    const testGoogleSignIn = async () => {
        setTesting(true);
        setResult(null);
        addLog('🔐 Starting Google Sign-In test...');

        try {
            // Dynamically import Firebase to ensure client-side only
            const { initializeApp, getApps } = await import('firebase/app');
            const { getAuth, GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');

            addLog('📦 Firebase modules loaded');

            const firebaseConfig = {
                apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
                authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
                messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
                appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
            };

            addLog(`🔑 API Key: ${firebaseConfig.apiKey?.substring(0, 10)}...`);
            addLog(`🌐 Auth Domain: ${firebaseConfig.authDomain}`);
            addLog(`📂 Project ID: ${firebaseConfig.projectId}`);

            // Initialize Firebase
            const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
            addLog('✅ Firebase app initialized');

            const auth = getAuth(app);
            addLog(`✅ Auth instance created`);
            addLog(`Current user: ${auth.currentUser?.email || 'None'}`);

            // Create provider
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({
                prompt: 'select_account'
            });
            addLog('✅ Google provider created');

            // Try sign in
            addLog('🚀 Opening Google Sign-In popup...');
            const result = await signInWithPopup(auth, provider);
            
            addLog(`✅✅✅ SUCCESS! Signed in as: ${result.user.email}`);
            addLog(`User ID: ${result.user.uid}`);
            addLog(`Display Name: ${result.user.displayName}`);
            
            setResult('success');
            
            // Redirect to home after 2 seconds
            setTimeout(() => {
                addLog('Redirecting to home...');
                router.push('/');
            }, 2000);

        } catch (error: any) {
            addLog(`❌ ERROR: ${error.code || 'Unknown'}`);
            addLog(`Message: ${error.message}`);
            addLog(`Full error: ${JSON.stringify(error, null, 2)}`);
            setResult('error');

            // Specific error guidance
            if (error.code === 'auth/unauthorized-domain') {
                addLog('');
                addLog('🔧 FIX: Add this domain to Firebase Console');
                addLog('   → Firebase Console → Authentication → Settings');
                addLog('   → Authorized domains → Add domain');
                addLog(`   → Add: ${window.location.hostname}`);
            } else if (error.code === 'auth/operation-not-allowed') {
                addLog('');
                addLog('🔧 FIX: Enable Google Sign-In in Firebase');
                addLog('   → Firebase Console → Authentication');
                addLog('   → Sign-in method → Google → Enable');
            } else if (error.code === 'auth/popup-blocked') {
                addLog('');
                addLog('🔧 FIX: Allow popups for this site');
                addLog('   → Check browser address bar for blocked popup icon');
            }
        } finally {
            setTesting(false);
        }
    };

    return (
        <div style={{ 
            padding: '40px', 
            fontFamily: 'monospace', 
            maxWidth: '900px', 
            margin: '0 auto',
            background: '#0a0a0a',
            minHeight: '100vh',
            color: '#fff'
        }}>
            <div style={{ 
                background: '#1a1a1a', 
                padding: '20px', 
                borderRadius: '8px',
                marginBottom: '20px',
                border: '2px solid #333'
            }}>
                <h1 style={{ margin: '0 0 10px 0', color: '#f59e0b' }}>🧪 Google Sign-In Test Lab</h1>
                <p style={{ margin: 0, color: '#999' }}>
                    This page tests Google Sign-In in isolation with detailed logging
                </p>
            </div>

            <div style={{ 
                background: '#1a1a1a', 
                padding: '20px', 
                borderRadius: '8px',
                marginBottom: '20px',
                border: '2px solid #333'
            }}>
                <button
                    onClick={testGoogleSignIn}
                    disabled={testing}
                    style={{
                        width: '100%',
                        padding: '15px',
                        fontSize: '16px',
                        background: testing ? '#666' : '#f59e0b',
                        color: '#000',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: testing ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                    }}
                >
                    {testing ? (
                        <>
                            <span style={{ 
                                display: 'inline-block',
                                width: '20px',
                                height: '20px',
                                border: '3px solid #000',
                                borderTopColor: 'transparent',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }} />
                            Testing...
                        </>
                    ) : (
                        <>
                            <svg width="24" height="24" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            🧪 Test Google Sign-In
                        </>
                    )}
                </button>

                {result === 'success' && (
                    <div style={{
                        marginTop: '20px',
                        padding: '15px',
                        background: '#065f46',
                        borderRadius: '6px',
                        border: '2px solid #10b981'
                    }}>
                        ✅ <strong>SUCCESS!</strong> Google Sign-In is working!
                    </div>
                )}

                {result === 'error' && (
                    <div style={{
                        marginTop: '20px',
                        padding: '15px',
                        background: '#7f1d1d',
                        borderRadius: '6px',
                        border: '2px solid #ef4444'
                    }}>
                        ❌ <strong>ERROR</strong> Check logs below for details and fix instructions
                    </div>
                )}
            </div>

            <div style={{ 
                background: '#1a1a1a', 
                padding: '20px', 
                borderRadius: '8px',
                border: '2px solid #333'
            }}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '15px'
                }}>
                    <h2 style={{ margin: 0, color: '#f59e0b' }}>📋 Test Logs</h2>
                    <button
                        onClick={() => setLogs([])}
                        style={{
                            padding: '8px 16px',
                            background: '#374151',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        Clear Logs
                    </button>
                </div>
                <div style={{
                    background: '#000',
                    padding: '15px',
                    borderRadius: '4px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    fontSize: '13px',
                    lineHeight: '1.6',
                    fontFamily: 'Consolas, Monaco, monospace'
                }}>
                    {logs.length === 0 ? (
                        <div style={{ color: '#666' }}>No logs yet. Click "Test Google Sign-In" to start.</div>
                    ) : (
                        logs.map((log, i) => (
                            <div key={i} style={{ 
                                marginBottom: '4px',
                                color: log.includes('❌') ? '#ef4444' : 
                                      log.includes('✅') ? '#10b981' : 
                                      log.includes('🔧') ? '#f59e0b' : '#9ca3af'
                            }}>
                                {log}
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div style={{ 
                marginTop: '20px', 
                textAlign: 'center' 
            }}>
                <a 
                    href="/" 
                    style={{ 
                        display: 'inline-block', 
                        padding: '12px 24px', 
                        background: '#374151', 
                        color: '#fff', 
                        textDecoration: 'none', 
                        borderRadius: '6px',
                        fontWeight: 'bold'
                    }}
                >
                    ← Back to Home
                </a>
            </div>

            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
