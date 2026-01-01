'use client';

import React, { useState, useEffect } from 'react';
import { generateDailyDigest, getOllamaStatus, getLatestReport } from '@/app/actions';
import type { Report } from '@/lib/schema';
import { jsPDF } from 'jspdf';

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

    function downloadPDF() {
        if (!report) return;

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        const maxWidth = pageWidth - (margin * 2);
        let y = margin;

        // Title
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(245, 158, 11); // Primary amber color
        doc.text('Nuntia', margin, y);
        y += 10;

        // Subtitle
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(128, 128, 128);
        doc.text('Daily Intelligence Digest', margin, y);
        y += 15;

        // Report title
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(report.title, margin, y);
        y += 8;

        // Meta info
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        const metaText = `${report.storyCount} stories analyzed${report.model ? ` • Model: ${report.model}` : ''}`;
        doc.text(metaText, margin, y);
        y += 12;

        // Horizontal line
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, y, pageWidth - margin, y);
        y += 10;

        // Content
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(40, 40, 40);

        // Process markdown-like content
        const lines = report.content.split('\n');

        for (const line of lines) {
            // Check if we need a new page
            if (y > doc.internal.pageSize.getHeight() - margin) {
                doc.addPage();
                y = margin;
            }

            // Headers
            if (line.startsWith('# ')) {
                doc.setFontSize(16);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(0, 0, 0);
                const text = line.replace(/^# /, '');
                doc.text(text, margin, y);
                y += 10;
            } else if (line.startsWith('## ')) {
                doc.setFontSize(14);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(40, 40, 40);
                const text = line.replace(/^## /, '');
                doc.text(text, margin, y);
                y += 9;
            } else if (line.startsWith('### ')) {
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(60, 60, 60);
                const text = line.replace(/^### /, '');
                doc.text(text, margin, y);
                y += 8;
            } else if (line.startsWith('- ') || line.startsWith('* ')) {
                // Bullet points
                doc.setFontSize(11);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(40, 40, 40);
                const text = line.replace(/^[-*] /, '');
                const cleanText = text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');
                const splitText = doc.splitTextToSize('• ' + cleanText, maxWidth - 5);
                doc.text(splitText, margin + 5, y);
                y += splitText.length * 6;
            } else if (line.trim()) {
                // Regular paragraph
                doc.setFontSize(11);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(40, 40, 40);
                const cleanText = line.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');
                const splitText = doc.splitTextToSize(cleanText, maxWidth);
                doc.text(splitText, margin, y);
                y += splitText.length * 6;
            } else {
                y += 4; // Empty line spacing
            }
        }

        // Footer
        y = doc.internal.pageSize.getHeight() - 15;
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Generated by Nuntia - ${new Date().toLocaleString()}`, margin, y);

        // Save the PDF
        const fileName = `nuntia-digest-${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
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
                                    <button onClick={downloadPDF} className="btn btn-secondary btn-sm">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="7 10 12 15 17 10" />
                                            <line x1="12" y1="15" x2="12" y2="3" />
                                        </svg>
                                        PDF
                                    </button>
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
