'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

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
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" /></svg>
                            About Nuntia
                        </h4>
                        <p style={{ fontSize: '0.94rem', opacity: 0.9 }}>
                            Nuntia is a modern, high-performance RSS reader designed for power users who value privacy and speed. It transforms messy web feeds into a clean, searchable intelligence stream, powered by local AI analysis.
                        </p>
                    </section>

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
            <button className="btn btn-secondary" onClick={() => setIsOpen(true)} title="Help Center">
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
