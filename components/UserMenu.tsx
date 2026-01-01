'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { AuthModal } from './AuthModal';

export function UserMenu() {
    const { user, loading, signOut, isConfigured } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    if (loading) {
        return <div className="user-menu-skeleton" />;
    }

    // Not signed in - show sign in button
    if (!user) {
        return (
            <>
                <button onClick={() => setShowModal(true)} className="btn btn-ghost user-signin-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                    {isConfigured ? 'Sign In' : 'Auth N/A'}
                </button>
                {showModal && <AuthModal onClose={() => setShowModal(false)} />}
            </>
        );
    }

    // Signed in - show user menu
    return (
        <div className="user-menu">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="user-avatar-btn"
                title={user.email || 'User'}
            >
                {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="user-avatar" />
                ) : (
                    <div className="user-avatar-placeholder">
                        {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                )}
            </button>

            {showDropdown && (
                <>
                    <div className="user-dropdown-overlay" onClick={() => setShowDropdown(false)} />
                    <div className="user-dropdown">
                        <div className="user-dropdown-header">
                            <span className="user-dropdown-name">{user.displayName || 'User'}</span>
                            <span className="user-dropdown-email">{user.email}</span>
                        </div>
                        <div className="user-dropdown-divider" />
                        <button onClick={() => { signOut(); setShowDropdown(false); }} className="user-dropdown-item danger">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            Sign Out
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
