'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const SUGGESTED_FEEDS = [
    { name: 'Hacker News', url: 'https://news.ycombinator.com/rss' },
    { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' },
    { name: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
    { name: 'Wired', url: 'https://www.wired.com/feed/rss' },
    { name: 'NYT World', url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml' },
    { name: 'BBC News', url: 'https://feeds.bbci.co.uk/news/rss.xml' },
    { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index' },
    { name: 'Dev.to', url: 'https://dev.to/feed' },
    { name: 'Reddit Programming', url: 'https://www.reddit.com/r/programming/.rss' },
    { name: 'Smashing Magazine', url: 'https://www.smashingmagazine.com/feed/' },
];

export function HelpButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const modalContent = isOpen ? (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
            <div className="modal" style={{ maxWidth: '40rem' }} onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setIsOpen(false)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                <h2 className="modal-title">Welcome to Nuntia.</h2>
                <p className="modal-subtitle">Your local intelligence briefing aggregator.</p>

                <div className="help-content" style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
                    <section style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>What is Nuntia?</h4>
                        <p style={{ fontSize: '0.94rem', opacity: 0.9 }}>
                            Nuntia is a modern RSS reader designed for focus and speed. It pulls stories from your favorite
                            websites and presents them in a clean, unified interface. It's built to run locally, ensuring your
                            reading habits stay private.
                        </p>
                    </section>

                    <section style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>How it works</h4>
                        <ul style={{ fontSize: '0.94rem', paddingLeft: '1.25rem', opacity: 0.9 }}>
                            <li><strong>Subscribe:</strong> Add any valid RSS or Atom feed URL in the sidebar.</li>
                            <li><strong>Aggregate:</strong> Click "Refresh" to fetch the latest stories from all your feeds.</li>
                            <li><strong>Filter:</strong> Use the search bar or topic chips to quickly find specific stories.</li>
                            <li><strong>AI Digest:</strong> Use the AI feature to get a summarized briefing of your news.</li>
                        </ul>
                    </section>

                    <section>
                        <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Suggested Feeds</h4>
                        <p style={{ fontSize: '0.875rem', marginBottom: '1rem', opacity: 0.7 }}>
                            Not sure where to start? Try these popular RSS feeds:
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
                            {SUGGESTED_FEEDS.map((feed) => (
                                <div key={feed.url} style={{
                                    padding: '0.75rem',
                                    background: 'var(--secondary)',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.25rem'
                                }}>
                                    <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>{feed.name}</span>
                                    <code style={{
                                        fontSize: '0.75rem',
                                        background: 'rgba(0,0,0,0.3)',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px',
                                        color: 'var(--primary)',
                                        wordBreak: 'break-all'
                                    }}>{feed.url}</code>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="modal-actions">
                    <button className="btn btn-primary" onClick={() => setIsOpen(false)}>Got it!</button>
                </div>
            </div>
            <style jsx>{`
                .help-content::-webkit-scrollbar {
                    width: 6px;
                }
                .help-content::-webkit-scrollbar-thumb {
                    background: var(--card-border);
                    border-radius: 10px;
                }
            `}</style>
        </div>
    ) : null;

    return (
        <>
            <button className="btn btn-secondary" onClick={() => setIsOpen(true)} title="Help & Suggested Feeds">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                Help
            </button>
            {mounted && createPortal(modalContent, document.body)}
        </>
    );
}
