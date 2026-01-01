'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

type AuthMode = 'signin' | 'signup' | 'reset';

export function AuthModal({ onClose }: { onClose: () => void }) {
    const { signIn, signUp, signInWithGoogle, resetPassword, error, clearError, isConfigured } = useAuth();
    const [mode, setMode] = useState<AuthMode>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    if (!isConfigured) {
        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal auth-modal" onClick={e => e.stopPropagation()}>
                    <button onClick={onClose} className="modal-close">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                    <div className="auth-not-configured">
                        <h3>Firebase Not Configured</h3>
                        <p>Add your Firebase credentials to <code>.env.local</code> to enable authentication.</p>
                    </div>
                </div>
            </div>
        );
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage('');
        clearError();

        try {
            if (mode === 'signin') {
                await signIn(email, password);
                onClose();
            } else if (mode === 'signup') {
                await signUp(email, password, displayName);
                onClose();
            } else if (mode === 'reset') {
                await resetPassword(email);
                setSuccessMessage('Password reset email sent! Check your inbox.');
            }
        } catch {
            // Error is handled by context
        } finally {
            setLoading(false);
        }
    }

    function switchMode(newMode: AuthMode) {
        setMode(newMode);
        clearError();
        setSuccessMessage('');
    }

    async function handleGoogleSignIn() {
        setLoading(true);
        clearError();
        try {
            await signInWithGoogle();
            onClose();
        } catch {
            // Error handled by context
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal auth-modal" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="modal-close">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                <div className="auth-header">
                    <h3 className="modal-title">
                        {mode === 'signin' && 'Welcome Back'}
                        {mode === 'signup' && 'Create Account'}
                        {mode === 'reset' && 'Reset Password'}
                    </h3>
                    <p className="modal-subtitle">
                        {mode === 'signin' && 'Sign in to access your personalized feed'}
                        {mode === 'signup' && 'Join Nuntia for AI-powered news digests'}
                        {mode === 'reset' && 'Enter your email to receive a reset link'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {mode === 'signup' && (
                        <div className="form-group">
                            <label htmlFor="displayName">Name</label>
                            <input
                                id="displayName"
                                type="text"
                                value={displayName}
                                onChange={e => setDisplayName(e.target.value)}
                                placeholder="Your name"
                                className="input auth-input"
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="input auth-input"
                            autoFocus
                        />
                    </div>

                    {mode !== 'reset' && (
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                required
                                minLength={6}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="input auth-input"
                            />
                        </div>
                    )}

                    {error && <div className="error-message">{error}</div>}
                    {successMessage && <div className="success-message">{successMessage}</div>}

                    <button type="submit" disabled={loading} className="btn btn-primary auth-submit">
                        {loading ? (
                            <span className="spinner" />
                        ) : (
                            <>
                                {mode === 'signin' && 'Sign In'}
                                {mode === 'signup' && 'Create Account'}
                                {mode === 'reset' && 'Send Reset Link'}
                            </>
                        )}
                    </button>
                </form>

                {mode !== 'reset' && (
                    <>
                        <div className="auth-divider-line">
                            <span>or continue with</span>
                        </div>
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            className="btn btn-google"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google
                        </button>
                    </>
                )}

                <div className="auth-footer">
                    {mode === 'signin' && (
                        <>
                            <button onClick={() => switchMode('reset')} className="auth-link">
                                Forgot password?
                            </button>
                            <span className="auth-divider">•</span>
                            <button onClick={() => switchMode('signup')} className="auth-link">
                                Create account
                            </button>
                        </>
                    )}
                    {mode === 'signup' && (
                        <button onClick={() => switchMode('signin')} className="auth-link">
                            Already have an account? Sign in
                        </button>
                    )}
                    {mode === 'reset' && (
                        <button onClick={() => switchMode('signin')} className="auth-link">
                            Back to sign in
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
