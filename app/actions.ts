'use server';

import { prisma } from '@/lib/db';
import { parseFeed } from '@/lib/rss';
import { revalidatePath } from 'next/cache';

export async function addFeed(url: string) {
    try {
        // 1. Validate URL format
        new URL(url);

        // 2. Check if already exists
        const existing = await prisma.feed.findUnique({
            where: { url },
        });
        if (existing) {
            return { success: false, error: 'Feed already exists' };
        }

        // 3. Parse RSS
        const feedData = await parseFeed(url);
        if (!feedData) {
            return { success: false, error: 'Invalid or inaccessible RSS feed' };
        }

        // 4. Save Feed
        const feed = await prisma.feed.create({
            data: {
                url,
                title: feedData.title || url,
                description: feedData.description,
                siteUrl: feedData.link,
                iconUrl: feedData.image,
            },
        });

        // 5. Save Initial Stories
        if (feedData.items.length > 0) {
            await prisma.story.createMany({
                skipDuplicates: true,
                data: feedData.items.map((item) => ({
                    guid: item.guid || item.link || item.title || 'unknown',
                    title: item.title || 'Untitled',
                    link: item.link || '',
                    pubDate: item.isoDate ? new Date(item.isoDate) : (item.pubDate ? new Date(item.pubDate) : new Date()),
                    content: item.content || item.contentSnippet,
                    feedId: feed.id,
                })),
            });
        }

        revalidatePath('/');
        return { success: true, feed };
    } catch (error) {
        console.error('Error adding feed:', error);
        return { success: false, error: 'Failed to add feed' };
    }
}

export async function getFeeds() {
    return await prisma.feed.findMany({
        orderBy: { createdAt: 'desc' },
    });
}

export async function getStories(limit = 50) {
    return await prisma.story.findMany({
        take: limit,
        orderBy: { pubDate: 'desc' },
        include: {
            feed: true,
        },
    });
}

export async function deleteFeed(id: string) {
    try {
        await prisma.feed.delete({
            where: { id },
        });
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to delete feed' };
    }
}

export async function refreshFeeds(formData?: FormData) {
    const feeds = await prisma.feed.findMany();
    for (const feed of feeds) {
        const data = await parseFeed(feed.url);
        if (data && data.items.length > 0) {
            await prisma.story.createMany({
                skipDuplicates: true,
                data: data.items.map((item) => ({
                    guid: item.guid || item.link || item.title || 'unknown',
                    title: item.title || 'Untitled',
                    link: item.link || '',
                    pubDate: item.isoDate ? new Date(item.isoDate) : (item.pubDate ? new Date(item.pubDate) : new Date()),
                    content: item.content || item.contentSnippet,
                    feedId: feed.id,
                })),
            });
        }
    }
    revalidatePath('/');
    return { success: true };
}
