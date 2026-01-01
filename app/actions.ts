'use server';

import { db } from '@/lib/db';
import { feeds, stories } from '@/lib/schema';
import { parseFeed } from '@/lib/rss';
import { revalidatePath } from 'next/cache';
import { eq, desc } from 'drizzle-orm';

export async function addFeed(url: string) {
    try {
        // 1. Validate URL
        new URL(url);

        // 2. Parse RSS
        const feedData = await parseFeed(url);
        if (!feedData) {
            return { success: false, error: 'Invalid or inaccessible RSS feed' };
        }

        // 3. Save Feed
        // Using simple approach: Try insert, if fails unique constraint it exists
        let feedId: string;
        try {
            const [inserted] = await db.insert(feeds).values({
                url,
                title: feedData.title || url,
                description: feedData.description,
                siteUrl: feedData.link,
                iconUrl: feedData.image,
            }).returning();
            feedId = inserted.id;
        } catch (e: any) {
            if (e.code === 'SQLITE_CONSTRAINT_UNIQUE' || e.message?.includes('UNIQUE constraint')) {
                return { success: false, error: 'Feed already exists' };
            }
            throw e;
        }

        // 4. Save Initial Stories
        if (feedData.items.length > 0) {
            // Drizzle doesn't have skipDuplicates for SQLite insertMany yet in a simple stable way 
            // without onConflictDoNothing which requires recent versions.
            // We'll iterate or use onConflictDoNothing if available (Drizzle kit push handles schema).
            // For now, simpler: map and insert with onConflictDoNothing

            const values = feedData.items.map((item) => ({
                guid: item.guid || item.link || item.title || 'unknown',
                title: item.title || 'Untitled',
                link: item.link || '',
                pubDate: item.isoDate ? new Date(item.isoDate) : (item.pubDate ? new Date(item.pubDate) : new Date()),
                content: item.content || item.contentSnippet,
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

export async function getFeeds() {
    return await db.select().from(feeds).orderBy(desc(feeds.createdAt));
}

export async function getStories(limit = 50) {
    // Query stories with their feed relation
    // Drizzle relational query API would be simpler: db.query.stories.findMany(...)
    // But standard API is fine too. Let's use Relation Queries for component compat if config is right.
    // schema.ts needs relations defined for that.
    // For now, let's manual join or just two queries? 
    // Efficient: SQL join.

    const result = await db.select({
        id: stories.id,
        guid: stories.guid,
        title: stories.title,
        link: stories.link,
        pubDate: stories.pubDate,
        content: stories.content,
        author: stories.author,
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
        .leftJoin(feeds, eq(stories.feedId, feeds.id))
        .orderBy(desc(stories.pubDate))
        .limit(limit);

    // Filter out any where feed might be null (shouldn't happen with FK)
    return result.filter(r => r.feed !== null) as any[];
}

export async function deleteFeed(id: string) {
    try {
        await db.delete(feeds).where(eq(feeds.id, id));
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to delete feed' };
    }
}

export async function refreshFeeds(formData?: FormData) {
    const allFeeds = await db.select().from(feeds);
    for (const feed of allFeeds) {
        const data = await parseFeed(feed.url);
        if (data && data.items.length > 0) {
            const values = data.items.map((item) => ({
                guid: item.guid || item.link || item.title || 'unknown',
                title: item.title || 'Untitled',
                link: item.link || '',
                pubDate: item.isoDate ? new Date(item.isoDate) : (item.pubDate ? new Date(item.pubDate) : new Date()),
                content: item.content || item.contentSnippet,
                feedId: feed.id,
            }));
            await db.insert(stories).values(values).onConflictDoNothing().execute();
        }
    }
    revalidatePath('/');
    return { success: true };
}
