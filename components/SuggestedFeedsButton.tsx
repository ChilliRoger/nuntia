'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const SUGGESTED_FEEDS = [
    { name: 'Hacker News', url: 'https://news.ycombinator.com/rss' },
    { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' },
    { name: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
    { name: 'BBC World News', url: 'https://feeds.bbci.co.uk/news/world/rss.xml' },
    { name: 'NYT Technology', url: 'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml' },
    { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index' },
    { name: 'Wired', url: 'https://www.wired.com/feed/rss' },
    { name: 'Dev.to', url: 'https://dev.to/feed' },
    { name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml' },
    { name: 'NPR News', url: 'https://feeds.npr.org/1001/rss.xml' },
    { name: 'The Guardian', url: 'https://www.theguardian.com/world/rss' },
    { name: 'MIT Tech Review', url: 'https://www.technologyreview.com/feed/' },
    { name: 'ProPublica', url: 'https://www.propublica.org/feeds/propublica/main' },
    { name: 'Lifehacker', url: 'https://lifehacker.com/rss' },
    { name: 'Gizmodo', url: 'https://gizmodo.com/rss' },
    { name: 'Polygon', url: 'https://www.polygon.com/rss/index.xml' },
    { name: 'Pitchfork', url: 'https://pitchfork.com/rss/all' },
    { name: 'Fast Company', url: 'https://www.fastcompany.com/latest/rss' },
    { name: 'Smashing Magazine', url: 'https://www.smashingmagazine.com/feed/' },
    { name: 'A List Apart', url: 'https://alistapart.com/main/feed/' },
    { name: 'Scientific American', url: 'http://rss.sciam.com/ScientificAmerican-Global' },
    { name: 'NASA Breaking News', url: 'https://www.nasa.gov/rss/dyn/breaking_news.rss' },
    { name: 'The Next Web', url: 'https://thenextweb.com/feed/' },
    { name: 'Engadget', url: 'https://www.engadget.com/rss.xml' },
    { name: '9to5Mac', url: 'https://9to5mac.com/feed/' },
    { name: 'CSS-Tricks', url: 'https://css-tricks.com/feed/' },
    { name: 'Slashdot', url: 'https://slashdot.org/slashdot.rss' },
    { name: 'Hugging Face Blog', url: 'https://huggingface.co/blog/feed.xml' },
];

export function SuggestedFeedsButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
        setCopiedUrl(url);
        setTimeout(() => setCopiedUrl(null), 2000);
    };

    const modalContent = isOpen ? (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
            <div className="modal" style={{ maxWidth: '44rem' }} onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setIsOpen(false)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                <h2 className="modal-title">Suggested RSS Feeds</h2>
                <p className="modal-subtitle">Copy and paste these URLs into the "Add Feed" section</p>

                <div className="help-content" style={{ maxHeight: '65vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', padding: '0.5rem' }}>
                        {SUGGESTED_FEEDS.map((feed) => (
                            <div key={feed.url} className="feed-item" style={{
                                padding: '1rem',
                                background: 'var(--secondary)',
                                borderRadius: '12px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem',
                                border: '1px solid var(--card-border)',
                                transition: 'all 0.2s ease',
                                position: 'relative'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: '700', fontSize: '0.94rem', color: 'var(--foreground)' }}>{feed.name}</span>
                                    <button
                                        onClick={() => copyToClipboard(feed.url)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: copiedUrl === feed.url ? '#22c55e' : 'var(--muted)',
                                            padding: '4px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600'
                                        }}
                                    >
                                        {copiedUrl === feed.url ? (
                                            <>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                Copied
                                            </>
                                        ) : (
                                            <>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                                                Copy
                                            </>
                                        )}
                                    </button>
                                </div>
                                <code style={{
                                    fontSize: '0.8125rem',
                                    background: 'rgba(0,0,0,0.3)',
                                    padding: '0.5rem',
                                    borderRadius: '6px',
                                    color: 'var(--primary)',
                                    wordBreak: 'break-all',
                                    fontFamily: 'monospace',
                                    border: '1px solid rgba(245, 158, 11, 0.1)'
                                }}>{feed.url}</code>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
                    <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setIsOpen(false)}>Done</button>
                </div>
            </div>
        </div>
    ) : null;

    return (
        <>
            <button className="btn btn-secondary" onClick={() => setIsOpen(true)} title="Suggested RSS Feeds">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 11a9 9 0 0 1 9 9" />
                    <path d="M4 4a16 16 0 0 1 16 16" />
                    <circle cx="5" cy="19" r="1" />
                    <path d="M16 4h4v4" />
                    <path d="M20 4l-6 6" />
                </svg>
                Suggested URLs
            </button>
            {mounted && createPortal(modalContent, document.body)}
        </>
    );
}
