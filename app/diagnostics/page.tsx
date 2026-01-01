'use client';

import { useEffect, useState } from 'react';

export default function DiagnosticsPage() {
    const [envCheck, setEnvCheck] = useState<Record<string, string>>({});

    useEffect(() => {
        // Check environment variables
        setEnvCheck({
            NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY 
                ? `✅ Set (${process.env.NEXT_PUBLIC_FIREBASE_API_KEY.substring(0, 10)}...)` 
                : '❌ MISSING',
            NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '❌ MISSING',
            NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '❌ MISSING',
            NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '❌ MISSING',
            NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '❌ MISSING',
            NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID 
                ? `✅ Set (${process.env.NEXT_PUBLIC_FIREBASE_APP_ID.substring(0, 15)}...)` 
                : '❌ MISSING',
        });
    }, []);

    return (
        <div style={{ padding: '40px', fontFamily: 'monospace', maxWidth: '800px', margin: '0 auto' }}>
            <h1>🔍 Nuntia Diagnostics</h1>
            
            <h2>Environment Variables</h2>
            <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                {Object.entries(envCheck).map(([key, value]) => (
                    <div key={key} style={{ marginBottom: '10px', fontFamily: 'monospace' }}>
                        <strong>{key}:</strong> {value}
                    </div>
                ))}
            </div>

            <h2>System Info</h2>
            <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                <div><strong>Hostname:</strong> {typeof window !== 'undefined' ? window.location.hostname : 'N/A'}</div>
                <div><strong>Protocol:</strong> {typeof window !== 'undefined' ? window.location.protocol : 'N/A'}</div>
                <div><strong>User Agent:</strong> {typeof window !== 'undefined' ? navigator.userAgent.substring(0, 100) : 'N/A'}...</div>
            </div>

            <h2>Firebase Status</h2>
            <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                <div><strong>Config Loaded:</strong> {Object.values(envCheck).every(v => v.includes('✅')) ? '✅ All variables set' : '❌ Some variables missing'}</div>
                <div><strong>Auth Domain:</strong> {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'Not configured'}</div>
                <div><strong>Project ID:</strong> {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'Not configured'}</div>
            </div>

            <h2>Instructions</h2>
            <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px' }}>
                <p>If any variables show ❌ MISSING:</p>
                <ol>
                    <li>Go to Vercel Dashboard</li>
                    <li>Navigate to Project Settings → Environment Variables</li>
                    <li>Add the missing variables</li>
                    <li>Redeploy the application</li>
                </ol>
                <p style={{ marginTop: '20px' }}>
                    <strong>Next:</strong> Once all variables are ✅, check Firebase Console to ensure:
                    <br />• Google Sign-In is enabled
                    <br />• {typeof window !== 'undefined' ? window.location.hostname : 'your-domain'} is in authorized domains
                </p>
            </div>

            <div style={{ marginTop: '40px', textAlign: 'center' }}>
                <a href="/" style={{ 
                    display: 'inline-block', 
                    padding: '12px 24px', 
                    background: '#f59e0b', 
                    color: '#000', 
                    textDecoration: 'none', 
                    borderRadius: '6px',
                    fontWeight: 'bold'
                }}>
                    ← Back to Home
                </a>
            </div>
        </div>
    );
}
