import { getStories, getFeeds, refreshFeeds } from './actions';
import { BentoGrid } from '@/components/BentoGrid';
import { FeedCard } from '@/components/FeedCard';
import { FeedManager } from '@/components/FeedManager';

// Revalidate every 15 minutes by default
export const revalidate = 900;

export default async function Home() {
  // Fetch data
  const [stories, feeds] = await Promise.all([
    getStories(50),
    getFeeds()
  ]);

  return (
    <main className="container min-h-screen pb-20">
      <header className="mb-12 mt-8 flex flex-col md:flex-row gap-4 justify-between items-end border-b border-card-border pb-6">
        <div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-2">
            <span className="text-primary">N</span>untia.
          </h1>
          <p className="text-muted text-lg">Your daily intelligence.</p>
        </div>

        <form action={refreshFeeds}>
          <button className="text-sm border border-card-border px-3 py-1 rounded hover:bg-secondary transition-colors text-muted hover:text-foreground">
            Refresh Now
          </button>
        </form>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar / Feed Manager */}
        <aside className="lg:col-span-1">
          <FeedManager feeds={feeds} />

          <div className="mt-8 text-xs text-muted opacity-50">
            <p>Nuntia v0.1.0</p>
            <p>Local RSS Aggregator</p>
          </div>
        </aside>

        {/* content */}
        <section className="lg:col-span-3">
          {stories.length > 0 ? (
            <BentoGrid>
              {stories.map((story, i) => (
                <FeedCard
                  key={story.id}
                  story={story}
                  // Feature the first item and every 7th item for visual variety
                  featured={i === 0 || i % 7 === 0}
                />
              ))}
            </BentoGrid>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-card-border rounded-lg">
              <h3 className="text-2xl font-serif mb-2">No stories yet</h3>
              <p className="text-muted max-w-sm">
                Add some RSS feeds in the sidebar to get started.
                Try <code>https://hacker-news.firebaseio.com/v0/topstories.json</code> (Wait, HN is API, use RSS: <code>https://news.ycombinator.com/rss</code>)
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
