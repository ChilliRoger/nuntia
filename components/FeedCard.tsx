import React from 'react';
import type { Story, Feed } from '@/lib/schema';
import { formatDistanceToNow } from 'date-fns';

interface FeedCardProps {
    story: Story & { feed: Pick<Feed, 'id' | 'title' | 'url' | 'iconUrl'> };
}

export function FeedCard({ story }: FeedCardProps) {
    const timeAgo = formatDistanceToNow(new Date(story.pubDate), { addSuffix: true });
    const previewText = story.content?.replace(/<[^>]*>/g, '') || '';

    return (
        <article className="story-card">
            <div className="story-card-content">
                <div className="story-meta">
                    <div className="story-source">
                        {story.feed.iconUrl ? (
                            <img src={story.feed.iconUrl} alt="" className="story-source-icon" />
                        ) : (
                            <div className="story-source-icon" />
                        )}
                        <span>{story.feed.title}</span>
                    </div>
                    <time>{timeAgo}</time>
                </div>

                <a href={story.link} target="_blank" rel="noopener noreferrer">
                    <h3 className="story-title">{story.title}</h3>
                </a>

                <p className="story-excerpt">{previewText}</p>

                <div className="story-footer">
                    <a href={story.link} target="_blank" rel="noopener noreferrer" className="story-link">
                        Read Full Story →
                    </a>
                </div>
            </div>
        </article>
    );
}
