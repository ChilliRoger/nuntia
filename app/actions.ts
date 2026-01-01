'use server';

import { db } from '@/lib/db';
import { feeds, stories, reports } from '@/lib/schema';
import { parseFeed } from '@/lib/rss';
import { generateDigest, checkOllamaHealth, listModels } from '@/lib/ollama';
import { revalidatePath } from 'next/cache';
import { eq, desc, gte, and } from 'drizzle-orm';

export async function addFeed(url: string, userId: string | null = null) {
    try {
        // 1. Validate URL
        new URL(url);

        // 2. Parse RSS
        const feedData = await parseFeed(url);
        if (!feedData) {
            return { success: false, error: 'Invalid or inaccessible RSS feed' };
        }

        // 3. Save Feed
        let feedId: string;
        try {
            const [inserted] = await db.insert(feeds).values({
                url,
                userId,
                title: feedData.title || url,
                description: feedData.description,
                siteUrl: feedData.link,
                iconUrl: feedData.image,
            }).returning();
            feedId = inserted.id;
        } catch (e: any) {
            if (e.code === 'SQLITE_CONSTRAINT_UNIQUE' || e.message?.includes('UNIQUE constraint')) {
                return { success: false, error: 'Feed already exists for this user' };
            }
            throw e;
        }

        // 4. Save Initial Stories
        if (feedData.items.length > 0) {
            const values = feedData.items.map((item) => ({
                guid: item.guid || item.link || item.title || 'unknown',
                title: item.title || 'Untitled',
                link: item.link || '',
                pubDate: item.isoDate ? new Date(item.isoDate) : (item.pubDate ? new Date(item.pubDate) : new Date()),
                content: item.content || item.contentSnippet,
                author: item.author,
                categories: item.categories?.length ? JSON.stringify(item.categories) : null,
                feedId: feedId,
            }));

            await db.insert(stories).values(values).onConflictDoNothing().execute();
        }

        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Error adding feed:', error);
        return { success: false, error: 'Failed to add feed' };
    }
}

export async function getFeeds(userId: string | null = null) {
    if (!userId) return [];
    return await db.select().from(feeds).where(eq(feeds.userId, userId)).orderBy(desc(feeds.createdAt));
}

export async function getStories(limit = 50, userId: string | null = null) {
    if (!userId) return [];

    const result = await db.select({
        id: stories.id,
        guid: stories.guid,
        title: stories.title,
        link: stories.link,
        pubDate: stories.pubDate,
        content: stories.content,
        author: stories.author,
        categories: stories.categories,
        isRead: stories.isRead,
        isSaved: stories.isSaved,
        feedId: stories.feedId,
        createdAt: stories.createdAt,
        feed: {
            id: feeds.id,
            title: feeds.title,
            url: feeds.url,
            iconUrl: feeds.iconUrl,
        }
    })
        .from(stories)
        .innerJoin(feeds, and(eq(stories.feedId, feeds.id), eq(feeds.userId, userId)))
        .orderBy(desc(stories.pubDate))
        .limit(limit);

    return result as any[];
}

export async function deleteFeed(id: string, userId: string | null = null) {
    try {
        if (!userId) return { success: false, error: 'Unauthorized' };
        await db.delete(feeds).where(and(eq(feeds.id, id), eq(feeds.userId, userId)));
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to delete feed' };
    }
}

export async function refreshFeeds(userId: string | null = null) {
    if (!userId) return;
    const allFeeds = await db.select().from(feeds).where(eq(feeds.userId, userId));
    for (const feed of allFeeds) {
        const data = await parseFeed(feed.url);
        if (data && data.items.length > 0) {
            const values = data.items.map((item) => ({
                guid: item.guid || item.link || item.title || 'unknown',
                title: item.title || 'Untitled',
                link: item.link || '',
                pubDate: item.isoDate ? new Date(item.isoDate) : (item.pubDate ? new Date(item.pubDate) : new Date()),
                content: item.content || item.contentSnippet,
                author: item.author,
                categories: item.categories?.length ? JSON.stringify(item.categories) : null,
                feedId: feed.id,
            }));
            await db.insert(stories).values(values).onConflictDoNothing().execute();
        }
    }
    revalidatePath('/');
}

// ============================================
// OLLAMA DIGEST ACTIONS
// ============================================

export async function getOllamaStatus() {
    const healthy = await checkOllamaHealth();
    const models = healthy ? await listModels() : [];
    return { available: healthy, models };
}

export async function getAvailableModels() {
    return await listModels();
}

export async function generateDailyDigest(model?: string, userId: string | null = null) {
    try {
        if (!userId) return { success: false, error: 'Sign in to generate digests' };

        // 1. Check Ollama is available
        const healthy = await checkOllamaHealth();
        if (!healthy) {
            return {
                success: false,
                error: 'Ollama is not running. Start it with: ollama serve'
            };
        }

        // 2. Get today's stories (last 24 hours) from user's feeds
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentStories = await db.select({
            title: stories.title,
            content: stories.content,
            source: feeds.title,
        })
            .from(stories)
            .innerJoin(feeds, and(eq(stories.feedId, feeds.id), eq(feeds.userId, userId)))
            .where(gte(stories.pubDate, oneDayAgo))
            .orderBy(desc(stories.pubDate))
            .limit(20);

        if (recentStories.length === 0) {
            return { success: false, error: 'No stories from the last 24 hours to summarize' };
        }

        // 3. Generate digest with Ollama
        const result = await generateDigest(
            recentStories.map(s => ({
                title: s.title,
                content: s.content,
                source: s.source || 'Unknown',
            })),
            model
        );

        if (!result.success) {
            return { success: false, error: result.error };
        }

        // 4. Save report to database
        const [report] = await db.insert(reports).values({
            userId,
            title: `Daily Digest - ${new Date().toLocaleDateString()}`,
            content: result.content!,
            storyCount: recentStories.length,
            model: result.model,
        }).returning();

        revalidatePath('/');
        return { success: true, report };
    } catch (error: any) {
        console.error('Digest generation error:', error);
        return { success: false, error: error.message || 'Failed to generate digest' };
    }
}

export async function getReports(limit = 10, userId: string | null = null) {
    if (!userId) return [];
    return await db.select().from(reports).where(eq(reports.userId, userId)).orderBy(desc(reports.createdAt)).limit(limit);
}

export async function getLatestReport(userId: string | null = null) {
    if (!userId) return null;
    const [report] = await db.select().from(reports).where(eq(reports.userId, userId)).orderBy(desc(reports.createdAt)).limit(1);
    return report || null;
}

