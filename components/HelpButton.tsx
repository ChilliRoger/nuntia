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
                        <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                            Privacy First
                        </h4>
                        <p style={{ fontSize: '0.94rem', opacity: 0.9 }}>
                            Nuntia is built with data sovereignty in mind. Your feed list, your reading history, and your saved stories never leave your local database. No tracking, no data mining—just you and your news.
                        </p>
                    </section>

                    <section style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                            AI Intelligence
                        </h4>
                        <ul style={{ fontSize: '0.94rem', paddingLeft: '1.25rem', opacity: 0.9 }}>
                            <li><strong>Local Summaries:</strong> Use Ollama to generate AI digests of your daily stories.</li>
                            <li><strong>Privacy-Preserving AI:</strong> Because Ollama runs on your machine, your stories are never sent to external AI servers.</li>
                            <li><strong>Topic Analysis:</strong> Our engine automatically categorizes your stories into 20+ technical and business topics.</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                            Pro Tips
                        </h4>
                        <ul style={{ fontSize: '0.94rem', paddingLeft: '1.25rem', opacity: 0.9 }}>
                            <li><strong>Finding Feeds:</strong> Most blogs have an RSS feed. Try adding <code>/rss</code> or <code>/feed</code> to the end of any URL.</li>
                            <li><strong>Sub-Second Refresh:</strong> Adding or deleting feeds triggers an instant UI update without page reloads.</li>
                            <li><strong>Filters:</strong> Use the topic chips above the stories to drill down into specific areas like "AI" or "Security".</li>
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <path d="M12 17h.01" />
                </svg>
                Help
            </button>
            {mounted && createPortal(modalContent, document.body)}
        </>
    );
}
