'use client';

import React, { useState } from 'react';
import { addFeed, deleteFeed } from '@/app/actions';
import { Plus, Trash2, Rss } from 'lucide-react';
import type { Feed } from '@/lib/schema';

export function FeedManager({ feeds }: { feeds: Feed[] }) {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const res = await addFeed(url);
        if (!res?.success) {
            setError(res?.error || 'Failed to add feed');
        } else {
            setUrl('');
        }
        setLoading(false);
    }

    return (
        <div className="mb-8 p-4 border border-card-border rounded-lg bg-card text-card-foreground">
            <h2 className="text-xl font-serif mb-4 flex items-center gap-2">
                <Rss className="w-5 h-5 text-primary" />
                Manage Feeds
            </h2>

            <form onSubmit={handleAdd} className="flex gap-2 mb-4">
                <input
                    type="url"
                    required
                    placeholder="https://example.com/feed.xml"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1 p-2 bg-secondary text-foreground rounded border border-card-border focus:border-primary outline-none"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded font-bold hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    {loading ? 'Adding...' : 'Add'}
                </button>
            </form>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <div className="space-y-2">
                {feeds.map(feed => (
                    <div key={feed.id} className="flex items-center justify-between p-2 bg-secondary/50 rounded hover:bg-secondary transition-colors">
                        <div className="truncate flex-1 pr-4">
                            <span className="font-bold text-sm block">{feed.title || 'Untitled'}</span>
                            <span className="text-xs text-muted truncate">{feed.url}</span>
                        </div>
                        <button
                            onClick={() => deleteFeed(feed.id)}
                            className="text-muted hover:text-red-500 p-1"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                {feeds.length === 0 && <p className="text-muted text-sm italic">No feeds subcribed yet.</p>}
            </div>
        </div>
    );
}
