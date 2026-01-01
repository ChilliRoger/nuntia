'use client';

import React, { useState } from 'react';
import { refreshFeeds } from '@/app/actions';
import { useAuth } from '@/lib/auth-context';

export function RefreshButton() {
    const { user } = useAuth();
    const [refreshing, setRefreshing] = useState(false);

    async function handleRefresh() {
        if (!user) return;
        setRefreshing(true);
        try {
            await refreshFeeds(user.uid);
            window.dispatchEvent(new CustomEvent('refreshStories'));
        } catch (error) {
            console.error('Refresh failed', error);
        } finally {
            setRefreshing(false);
        }
    }

    return (
        <button
            onClick={handleRefresh}
            disabled={!user || refreshing}
            className={`btn btn-secondary ${refreshing ? 'refreshing' : ''}`}
            title="Refresh all feeds"
        >
            <svg
                className={refreshing ? 'spin' : ''}
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
                <path d="M23 4v6h-6" /><path d="M1 20v-6h6" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
    );
}
