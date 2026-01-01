import Parser from 'rss-parser';

export interface FeedData {
    title?: string;
    description?: string;
    link?: string;
    image?: string;
    items: FeedItem[];
}

export interface FeedItem {
    title?: string;
    link?: string;
    pubDate?: string;
    content?: string;
    contentSnippet?: string;
    guid?: string;
    categories?: string[];
    isoDate?: string;
}

const parser = new Parser({
    customFields: {
        item: ['media:content', 'content:encoded'],
    },
});

export async function parseFeed(url: string): Promise<FeedData | null> {
    try {
        const feed = await parser.parseURL(url);

        return {
            title: feed.title,
            description: feed.description,
            link: feed.link,
            image: feed.image?.url,
            items: feed.items.map(item => ({
                title: item.title,
                link: item.link,
                pubDate: item.pubDate,
                content: item['content:encoded'] || item.content,
                contentSnippet: item.contentSnippet,
                guid: item.guid || item.link || item.title, // Fallback guid
                categories: item.categories,
                isoDate: item.isoDate,
            })),
        };
    } catch (error) {
        console.error(`Error parsing feed ${url}:`, error);
        return null;
    }
}
