'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

type AuthMode = 'signin' | 'signup' | 'reset';

export function AuthModal({ onClose }: { onClose: () => void }) {
    const { signIn, signUp, resetPassword, error, clearError, isConfigured } = useAuth();
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
