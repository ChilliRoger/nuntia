/**
 * Application Types - Centralized type definitions
 * Production-ready with future Firebase auth support
 */

// Re-export database types
export type { Feed, NewFeed, Story, NewStory, Report, NewReport } from './schema';

// Future: User type for Firebase authentication
export interface User {
    id: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    createdAt: Date;
    updatedAt: Date;
}

// API Response types
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
}

// Ollama types
export interface OllamaStatus {
    available: boolean;
    models: string[];
}

export interface DigestResult {
    success: boolean;
    report?: import('./schema').Report;
    error?: string;
}

// Feed action types
export interface AddFeedResult {
    success: boolean;
    error?: string;
}

// Story with feed relation (as returned by getStories)
export interface StoryWithFeed {
    id: string;
    guid: string;
    title: string;
    link: string;
    pubDate: Date;
    content: string | null;
    author: string | null;
    isRead: boolean;
    isSaved: boolean;
    feedId: string;
    createdAt: Date;
    feed: {
        id: string;
        title: string | null;
        url: string;
        iconUrl: string | null;
    };
}
