import { getStories, getFeeds, refreshFeeds } from './actions';
import { StoryGrid } from '@/components/StoryGrid';
import { FeedCard } from '@/components/FeedCard';
import { FeedManager } from '@/components/FeedManager';
import { DigestPanel } from '@/components/DigestPanel';
import { UserMenu } from '@/components/UserMenu';

export const revalidate = 900;

export default async function Home() {
  const [stories, feeds] = await Promise.all([
    getStories(50),
    getFeeds()
  ]);

  return (
    <div className="app-container">
      <header className="app-header">
        <div>
          <h1 className="app-title">
            <span className="highlight">N</span>untia.
          </h1>
          <p className="app-subtitle">Your daily intelligence briefing</p>
        </div>

        <div className="header-actions">
          <DigestPanel />
          <form action={refreshFeeds}>
            <button type="submit" className="btn btn-secondary btn-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              Refresh
            </button>
          </form>
          <UserMenu />
        </div>
      </header>

      <main className="main-layout">
        <aside className="sidebar">
          <FeedManager feeds={feeds} />
          <div className="sidebar-footer">
            <p>Nuntia v0.1.0</p>
            <p>Local RSS Aggregator</p>
          </div>
        </aside>

        <section>
          {stories.length > 0 ? (
            <StoryGrid>
              {stories.map((story) => (
                <FeedCard key={story.id} story={story} />
              ))}
            </StoryGrid>
          ) : (
            <div className="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ marginBottom: '1rem', opacity: 0.3 }}>
                <path d="M4 11a9 9 0 0 1 9 9" /><path d="M4 4a16 16 0 0 1 16 16" /><circle cx="5" cy="19" r="1" />
              </svg>
              <h3>No stories yet</h3>
              <p>
                Add some RSS feeds to get started. Try <code>https://news.ycombinator.com/rss</code>
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
