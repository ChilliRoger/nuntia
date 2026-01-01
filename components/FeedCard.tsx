import React from 'react';
import type { Story, Feed } from '@/lib/schema';
import { formatDistanceToNow } from 'date-fns';

interface FeedCardProps {
    story: Story & { feed: Pick<Feed, 'id' | 'title' | 'url' | 'iconUrl'> };
}

// Topic detection keywords for auto-tagging
const TOPIC_KEYWORDS: Record<string, string[]> = {
    'AI': ['ai', 'artificial intelligence', 'machine learning', 'deep learning', 'llm', 'gpt', 'neural', 'chatgpt', 'openai', 'anthropic', 'claude', 'gemini', 'llama'],
    'Tech': ['software', 'hardware', 'startup', 'tech', 'developer', 'programming', 'code', 'app', 'open source', 'github', 'gitlab', 'framework', 'library', 'api'],
    'OS': ['windows', 'linux', 'macos', 'ios', 'android', 'ubuntu', 'debian', 'arch', 'fedora', 'microsoft', 'apple'],
    'Web': ['browser', 'chrome', 'firefox', 'safari', 'edge', 'css', 'html', 'javascript', 'typescript', 'react', 'next.js', 'node', 'web'],
    'Security': ['security', 'hack', 'vulnerability', 'breach', 'cyber', 'malware', 'privacy', 'ransomware', 'phishing', 'auth', 'cve'],
    'Business': ['funding', 'investment', 'ipo', 'acquisition', 'revenue', 'market', 'stock', 'economy', 'finance', 'venture', 'capital'],
    'Science': ['research', 'study', 'discovery', 'scientists', 'experiment', 'physics', 'biology', 'chemistry', 'space', 'nasa', 'astronomy'],
    'Energy': ['energy', 'battery', 'solar', 'wind', 'nuclear', 'climate', 'electric', 'ev', 'tesla', 'power', 'grid'],
    'Design': ['design', 'ui', 'ux', 'interface', 'css', 'figma', 'typography', 'logo', 'brand'],
    'Hardware': ['cpu', 'gpu', 'ram', 'intel', 'amd', 'nvidia', 'arm', 'chip', 'processor', 'device', 'phone', 'laptop', 'desktop', 'screen'],
    'Gaming': ['game', 'gaming', 'playstation', 'xbox', 'nintendo', 'steam', 'valve', 'esports', 'twitch'],
    'Crypto': ['crypto', 'bitcoin', 'blockchain', 'ethereum', 'web3', 'nft', 'wallet', 'coin', 'token'],
    'Social': ['social', 'meta', 'facebook', 'twitter', 'x.com', 'instagram', 'tiktok', 'linkedin', 'reddit', 'bluesky', 'threads'],
};

function detectTopics(title: string, content: string): string[] {
    const text = `${title} ${content}`.toLowerCase();
    const detected: string[] = [];

    for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
        if (keywords.some(kw => text.includes(kw))) {
            detected.push(topic);
        }
        if (detected.length >= 3) break; // Max 3 topics
    }

    return detected;
}

export function FeedCard({ story }: FeedCardProps) {
    const timeAgo = formatDistanceToNow(new Date(story.pubDate), { addSuffix: true });

    // Clean HTML and get text content
    // Clean HTML and get text content
    let textContent = story.content?.replace(/<[^>]*>/g, '') || '';

    // Aggressive filtering for "Comments" artifacts
    const lowerContent = textContent.trim().toLowerCase();
    if (
        lowerContent === 'comments' ||
        lowerContent === 'comments.' ||
        lowerContent.startsWith('comments\n') ||
        (lowerContent.length < 15 && lowerContent.includes('comments'))
    ) {
        textContent = '';
    }

    const previewText = textContent.slice(0, 180);

    // Calculate reading time (avg 200 words per minute)
    const wordCount = textContent.split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    // Get categories from RSS or auto-detect topics
    let topics: string[] = [];
    if (story.categories) {
        try {
            const parsed = JSON.parse(story.categories);
            topics = Array.isArray(parsed) ? parsed.slice(0, 3) : [];
        } catch {
            topics = [];
        }
    }

    // Auto-detect if no categories from feed
    if (topics.length === 0) {
        topics = detectTopics(story.title, textContent);
    }

    // Ensure at least one badge
    if (topics.length === 0) {
        topics = ['News'];
    }

    const renderText = (val: unknown): string => {
        if (typeof val === 'string') return val;
        if (!val) return '';
        if (typeof val === 'object' && val !== null) {
            const obj = val as Record<string, unknown>;
            return (obj._ as string) || (obj.name as string) || JSON.stringify(val);
        }
        return String(val);
    };

    return (
        <article className="story-card">
            <div className="story-card-content">
                {/* Header with source and time */}
                <div className="story-meta">
                    <div className="story-source">
                        {story.feed.iconUrl ? (
                            <img src={story.feed.iconUrl} alt="" className="story-source-icon" />
                        ) : (
                            <div className="story-source-icon">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16" />
                                    <circle cx="5" cy="19" r="1" />
                                </svg>
                            </div>
                        )}
                        <span>{renderText(story.feed.title)}</span>
                    </div>
                    <time>{timeAgo}</time>
                </div>

                {/* Title */}
                <a href={story.link} target="_blank" rel="noopener noreferrer" className="story-title-link">
                    <h3 className="story-title">{renderText(story.title)}</h3>
                </a>

                {/* Author if available */}
                {story.author && (
                    <div className="story-author">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                        <span>{renderText(story.author)}</span>
                    </div>
                )}

                {/* Content preview */}
                <p className="story-excerpt">
                    {renderText(previewText)}{previewText.length >= 180 ? '...' : ''}
                </p>

                {/* Topic Badges */}
                {topics.length > 0 && (
                    <div className="story-badges" style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
                        {topics.map((topic, i) => (
                            <span key={i} className="story-badge">{renderText(topic)}</span>
                        ))}
                    </div>
                )}

                {/* Footer with stats and link */}
                <div className="story-footer">
                    <div className="story-stats">
                        <span className="story-stat">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            {readingTime} min
                        </span>
                        {wordCount > 10 && (
                            <span className="story-stat">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                </svg>
                                {wordCount} words
                            </span>
                        )}
                    </div>
                    <a href={story.link} target="_blank" rel="noopener noreferrer" className="story-link">
                        Read
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </a>
                </div>
            </div>
        </article>
    );
}
