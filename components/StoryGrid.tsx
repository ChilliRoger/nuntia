import React from 'react';

interface StoryGridProps {
    children: React.ReactNode;
}

export function StoryGrid({ children }: StoryGridProps) {
    return (
        <div className="story-grid">
            {children}
        </div>
    );
}
