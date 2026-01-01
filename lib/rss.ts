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
    author?: string;
}

const parser = new Parser({
    customFields: {
        item: ['media:content', 'content:encoded', 'dc:creator', 'author'],
    },
});

function cleanString(val: any): string {
    if (typeof val === 'string') return val;
    if (!val) return '';
    if (typeof val === 'object') {
        if (val._) return val._;
        if (val.name) return val.name; // Common for author
        return '';
    }
    return String(val);
}

export async function parseFeed(url: string): Promise<FeedData | null> {
    try {
        const feed = await parser.parseURL(url);

        return {
            title: cleanString(feed.title),
            description: cleanString(feed.description),
            link: feed.link,
            image: feed.image?.url,
            items: feed.items.map(item => {
                const author = cleanString(item.author || item['dc:creator'] || '');
                return {
                    title: cleanString(item.title),
                    link: item.link,
                    pubDate: item.pubDate,
                    content: cleanString(item['content:encoded'] || item.content || item.contentSnippet),
                    contentSnippet: cleanString(item.contentSnippet),
                    guid: item.guid || item.link || item.title, // Fallback guid
                    categories: item.categories,
                    isoDate: item.isoDate,
                    author: author,
                };
            }),
        };
    } catch (error) {
        console.error(`Error parsing feed ${url}:`, error);
        return null;
    }
}
