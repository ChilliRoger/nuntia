'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { addFeed, deleteFeed, getFeeds } from '@/app/actions';
import { useAuth } from '@/lib/auth-context';
import type { Feed } from '@/lib/schema';

export function FeedManager({ feeds: initialFeeds }: { feeds: Feed[] }) {
    const { user, loading: authLoading } = useAuth();
    const [feeds, setFeeds] = useState<Feed[]>(initialFeeds);
    const [isOpen, setIsOpen] = useState(false);
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    // Refresh feeds when user state changes
    useEffect(() => {
        setMounted(true);
        if (user) {
            getFeeds(user.uid).then(setFeeds);
        } else if (!authLoading) {
            setFeeds([]);
        }
    }, [user, authLoading]);

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        if (!user) {
            setError('Please sign in to add feeds');
            return;
        }
        setLoading(true);
        setError(null);

        const res = await addFeed(url, user.uid);
        const typedRes = res as { success: boolean; error?: string };
        if (!typedRes.success) {
            setError(typedRes.error || 'Failed to add feed');
        } else {
            setUrl('');
            setIsOpen(false);
            // Refresh feed list
            const updated = await getFeeds(user.uid);
            setFeeds(updated);
            // Notify other components to refresh stories
            window.dispatchEvent(new CustomEvent('refreshStories'));
        }
        setLoading(false);
    }

    async function handleDelete(id: string) {
        if (!user) return;
        const res = await deleteFeed(id, user.uid);
        if (res.success) {
            setFeeds(feeds.filter(f => f.id !== id));
            // Notify other components to refresh stories
            window.dispatchEvent(new CustomEvent('refreshStories'));
        }
    }

    const modalContent = isOpen ? (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <button onClick={() => setIsOpen(false)} className="modal-close">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                <h3 className="modal-title">Add New Feed</h3>
                <p className="modal-subtitle">Enter an RSS or Atom feed URL to subscribe</p>

                <form onSubmit={handleAdd}>
                    <div className="input-group">
                        <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                        <input
                            type="url"
                            required
                            placeholder="https://example.com/rss.xml"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="input"
                            autoFocus
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="modal-actions">
                        <button type="button" onClick={() => setIsOpen(false)} className="btn btn-ghost">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="btn btn-primary">
                            {loading ? 'Adding...' : 'Subscribe'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    ) : null;

    return (
        <>
            <div className="feed-manager">
                <div className="feed-manager-header">
                    <h2 className="feed-manager-title">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 11a9 9 0 0 1 9 9" /><path d="M4 4a16 16 0 0 1 16 16" /><circle cx="5" cy="19" r="1" />
                        </svg>
                        Your Feeds
                    </h2>
                    <button onClick={() => setIsOpen(true)} className="btn btn-primary btn-sm" disabled={!user}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add Feed
                    </button>
                </div>

                <div className="feed-list">
                    {!user && !authLoading ? (
                        <div className="empty-feeds" style={{ padding: '2rem 1rem' }}>
                            <p style={{ opacity: 0.7, fontSize: '0.875rem' }}>Sign in to manage your feeds</p>
                        </div>
                    ) : (
                        <>
                            {feeds.map(feed => (
                                <div key={feed.id} className="feed-item">
                                    <div className="feed-item-info">
                                        <div className="feed-icon">
                                            {feed.iconUrl ? (
                                                <img src={feed.iconUrl} alt="" />
                                            ) : (
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M4 11a9 9 0 0 1 9 9" /><path d="M4 4a16 16 0 0 1 16 16" /><circle cx="5" cy="19" r="1" />
                                                </svg>
                                            )}
                                        </div>
                                        <div className="feed-details">
                                            <div className="feed-name">{feed.title || 'Untitled Feed'}</div>
                                            <div className="feed-url">{feed.url}</div>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDelete(feed.id)} className="feed-delete-btn" title="Remove feed">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                            {feeds.length === 0 && user && (
                                <div className="empty-feeds">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 0.5rem' }}>
                                        <path d="M4 11a9 9 0 0 1 9 9" /><path d="M4 4a16 16 0 0 1 16 16" /><circle cx="5" cy="19" r="1" />
                                    </svg>
                                    <p>No feeds subscribed yet</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {mounted && createPortal(modalContent, document.body)}
        </>
    );
}
