'use client';

import React, { useState, useEffect } from 'react';
import { generateDailyDigest, getOllamaStatus, getLatestReport, getAvailableModels } from '@/app/actions';
import type { Report } from '@/lib/schema';

export function DigestPanel() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [report, setReport] = useState<Report | null>(null);
    const [ollamaStatus, setOllamaStatus] = useState<{ available: boolean; models: string[] } | null>(null);
    const [selectedModel, setSelectedModel] = useState<string>('');

    // Check Ollama status on mount
    useEffect(() => {
        checkStatus();
    }, []);

    async function checkStatus() {
        const status = await getOllamaStatus();
        setOllamaStatus(status);
        if (status.models.length > 0 && !selectedModel) {
            setSelectedModel(status.models[0]);
        }
    }

    // Load latest report when panel opens
    useEffect(() => {
        if (isOpen && !report) {
            getLatestReport().then(r => setReport(r));
        }
    }, [isOpen, report]);

    async function handleGenerate() {
        setLoading(true);
        setError(null);

        const result = await generateDailyDigest(selectedModel || undefined);

        if (result.success && result.report) {
            setReport(result.report);
        } else {
            setError(result.error || 'Failed to generate digest');
        }
        setLoading(false);
    }

    const hasModels = ollamaStatus?.models && ollamaStatus.models.length > 0;

    return (
        <>
            <button onClick={() => setIsOpen(true)} className="btn btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                AI Digest
            </button>

            {isOpen && (
                <div className="modal-overlay" onClick={() => setIsOpen(false)}>
                    <div className="digest-modal" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setIsOpen(false)} className="modal-close">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>

                        <div className="digest-header">
                            <h3 className="modal-title">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--primary)' }}>
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                                Daily Intelligence Digest
                            </h3>

                            <div className="ollama-status">
                                <span className={`status-dot ${ollamaStatus?.available ? 'online' : 'offline'}`} />
                                Ollama: {ollamaStatus === null ? 'Checking...' : ollamaStatus.available ? 'Connected' : 'Offline'}
                            </div>
                        </div>

                        {/* Ollama Not Running */}
                        {ollamaStatus && !ollamaStatus.available && (
                            <div className="ollama-warning">
                                <p><strong>Ollama is not running.</strong></p>
                                <p>Start Ollama to generate AI digests:</p>
                                <code>ollama serve</code>
                            </div>
                        )}

                        {/* No Models Installed */}
                        {ollamaStatus?.available && !hasModels && (
                            <div className="ollama-warning">
                                <p><strong>No models installed.</strong></p>
                                <p>Download a model to get started:</p>
                                <code>ollama pull llama3.2:1b</code>
                                <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', opacity: 0.7 }}>
                                    (1b = 1 billion params, fastest option)
                                </p>
                            </div>
                        )}

                        {/* Model Selector & Generate Button */}
                        {hasModels && (
                            <div className="digest-actions">
                                <div className="model-selector">
                                    <label htmlFor="model-select">Model:</label>
                                    <select
                                        id="model-select"
                                        value={selectedModel}
                                        onChange={e => setSelectedModel(e.target.value)}
                                        className="model-select"
                                    >
                                        {ollamaStatus?.models.map(model => (
                                            <option key={model} value={model}>{model}</option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    onClick={handleGenerate}
                                    disabled={loading}
                                    className="btn btn-primary"
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polygon points="5 3 19 12 5 21 5 3" />
                                            </svg>
                                            Generate Report
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {error && <div className="error-message" style={{ margin: '1rem 1.5rem' }}>{error}</div>}

                        {report && (
                            <div className="digest-content">
                                <div className="digest-meta">
                                    <span>{report.title}</span>
                                    <span>{report.storyCount} stories</span>
                                    {report.model && <span>via {report.model}</span>}
                                </div>
                                <div className="digest-body" dangerouslySetInnerHTML={{ __html: formatMarkdown(report.content) }} />
                            </div>
                        )}

                        {!report && !loading && hasModels && (
                            <div className="digest-empty">
                                <p>No reports yet. Click "Generate Report" to create your first AI digest.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

// Simple markdown to HTML converter
function formatMarkdown(text: string): string {
    return text
        .replace(/^### (.*$)/gim, '<h4>$1</h4>')
        .replace(/^## (.*$)/gim, '<h3>$1</h3>')
        .replace(/^# (.*$)/gim, '<h2>$1</h2>')
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/gim, '<em>$1</em>')
        .replace(/^\- (.*$)/gim, '<li>$1</li>')
        .replace(/^\* (.*$)/gim, '<li>$1</li>')
        .replace(/\n/gim, '<br/>');
}
