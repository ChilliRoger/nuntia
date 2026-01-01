'use client';

import React, { useState, useMemo } from 'react';
import { Story } from '@/lib/schema';
import { FeedCard } from '@/components/FeedCard';
import { StoryGrid } from '@/components/StoryGrid';

interface StoryBrowserProps {
    initialStories: (Story & { feed: { id: string; title: string | null; url: string; iconUrl: string | null; } })[];
}

const ALL_TOPICS = ['All', 'AI', 'Tech', 'Security', 'Business', 'Science', 'Design', 'Mobile', 'Gaming', 'Crypto'];

export function StoryBrowser({ initialStories }: StoryBrowserProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('All');

    const filteredStories = useMemo(() => {
        let result = initialStories;

        // 1. Filter by Topic
        if (selectedTopic !== 'All') {
            result = result.filter(story => {
                // Check explicit categories
                let storyTopics: string[] = [];
                if (story.categories) {
                    try {
                        const parsed = JSON.parse(story.categories);
                        if (Array.isArray(parsed)) storyTopics = parsed;
                    } catch { }
                }

                // Check implicit content match if no explicit tag or as fallback
                const contentMatch = (story.title + ' ' + (story.content || '')).toLowerCase().includes(selectedTopic.toLowerCase());

                return storyTopics.some(t => t.toLowerCase() === selectedTopic.toLowerCase()) || contentMatch;
            });
        }

        // 2. Filter by Search Query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(story =>
                story.title.toLowerCase().includes(query) ||
                (story.content || '').toLowerCase().includes(query)
            );
        }

        return result;
    }, [initialStories, selectedTopic, searchQuery]);

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
                    <h3>No matches found</h3>
                    <p>Try adjusting your search or filters.</p>
                </div>
            )}
        </div>
    );
}
