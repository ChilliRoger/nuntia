import React from 'react';
import type { Story, Feed } from '@/lib/schema';
import { formatDistanceToNow } from 'date-fns';
import { BentoGridItem } from './BentoGrid';

interface FeedCardProps {
    story: Story & { feed: Feed };
    featured?: boolean;
}

export function FeedCard({ story, featured = false }: FeedCardProps) {
    const timeAgo = formatDistanceToNow(new Date(story.pubDate), { addSuffix: true });

    return (
        <BentoGridItem colSpan={featured ? 2 : 1} rowSpan={featured ? 2 : 1} className="flex flex-col justify-between h-full bg-card border-card-border hover:border-primary transition-colors">
            <div className="p-4 flex flex-col h-full">
                <div className="flex items-center justify-between mb-2 text-xs text-muted">
                    <span className="flex items-center gap-1">
                        {story.feed.iconUrl && <img src={story.feed.iconUrl} alt="" className="w-4 h-4 rounded-sm" />}
                        {story.feed.title}
                    </span>
                    <span>{timeAgo}</span>
                </div>

                <a href={story.link} target="_blank" rel="noopener noreferrer" className="group">
                    <h3 className={`font-serif font-bold mb-2 group-hover:text-primary transition-colors ${featured ? 'text-2xl' : 'text-lg'}`}>
                        {story.title}
                    </h3>
                </a>

                <p className="text-sm text-secondary-foreground line-clamp-3 mt-auto">
                    {story.content?.replace(/<[^>]*>/g, '').slice(0, featured ? 200 : 100)}...
                </p>
            </div>
        </BentoGridItem>
    );
}
