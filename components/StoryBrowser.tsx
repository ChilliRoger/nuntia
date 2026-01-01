'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { getStories } from '@/app/actions';
import { useAuth } from '@/lib/auth-context';
import type { Story } from '@/lib/schema';
import { FeedCard } from '@/components/FeedCard';
import { StoryGrid } from '@/components/StoryGrid';

type StoryWithFeed = (Story & { feed: { id: string; title: string | null; url: string; iconUrl: string | null; } });

interface StoryBrowserProps {
    initialStories: StoryWithFeed[];
}

const ALL_TOPICS = ['All', 'AI', 'Tech', 'Security', 'Business', 'Science', 'Design', 'Mobile', 'Gaming', 'Crypto'];

export function StoryBrowser({ initialStories }: StoryBrowserProps) {
    const { user, loading: authLoading } = useAuth();
    const [stories, setStories] = useState<StoryWithFeed[]>(initialStories);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('All');
    const [loading, setLoading] = useState(false);

    // Fetch stories when user changes
    useEffect(() => {
        if (user) {
            setLoading(true);
            getStories(50, user.uid).then(data => {
                setStories(data);
                setLoading(false);
            });
        } else if (!authLoading) {
            setStories([]);
        }
    }, [user, authLoading]);

    // Handle manual refresh requests
    useEffect(() => {
        const handleRefresh = () => {
            if (user) {
                getStories(50, user.uid).then(setStories);
            }
        };
        window.addEventListener('refreshStories', handleRefresh);
        return () => window.removeEventListener('refreshStories', handleRefresh);
    }, [user]);

    const filteredStories = useMemo(() => {
        let result = stories;

        if (selectedTopic !== 'All') {
            result = result.filter(story => {
                let storyTopics: string[] = [];
                if (story.categories) {
                    try {
                        const parsed = JSON.parse(story.categories);
                        if (Array.isArray(parsed)) storyTopics = parsed;
                    } catch { }
                }
                const contentMatch = (story.title + ' ' + (story.content || '')).toLowerCase().includes(selectedTopic.toLowerCase());
                return storyTopics.some(t => t.toLowerCase() === selectedTopic.toLowerCase()) || contentMatch;
            });
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(story =>
                story.title.toLowerCase().includes(query) ||
                (story.content || '').toLowerCase().includes(query)
            );
        }

        return result;
    }, [stories, selectedTopic, searchQuery]);

    if (authLoading || loading) {
        return (
            <div className="story-browser">
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                    <div className="spinner" />
                </div>
            </div>
        );
    }

    if (!user && !authLoading) {
        return (
            <div className="story-browser" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="empty-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ marginBottom: '1.5rem', opacity: 0.2 }}>
                        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
                        <path d="M12 7v5l3 3" />
                        <path d="M20 12h2" /><path d="M2 12h2" /><path d="M12 2v2" /><path d="M12 20v2" />
                    </svg>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Welcome to Nuntia</h2>
                    <p style={{ opacity: 0.6 }}>Please sign in to view your personalized RSS feed.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="story-browser">
            {/* Search and Filter Header */}
            <div className="browser-controls">
                <div className="search-bar">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="search-icon">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search stories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="topic-filters">
                    {ALL_TOPICS.map(topic => (
                        <button
                            key={topic}
                            onClick={() => setSelectedTopic(topic)}
                            className={`filter-chip ${selectedTopic === topic ? 'active' : ''}`}
                        >
                            {topic}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results */}
            {filteredStories.length > 0 ? (
                <StoryGrid>
                    {filteredStories.map((story) => (
                        <FeedCard key={story.id} story={story} />
                    ))}
                </StoryGrid>
            ) : (
                <div className="empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ marginBottom: '1rem', opacity: 0.3 }}>
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <h3>No stories found</h3>
                    <p>{searchQuery ? 'Try adjusting your search or filters.' : 'Add some feeds to get started.'}</p>
                </div>
            )}
        </div>
    );
}
