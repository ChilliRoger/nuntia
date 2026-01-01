import { getStories, getFeeds } from './actions';
import { StoryBrowser } from '@/components/StoryBrowser';
import { FeedManager } from '@/components/FeedManager';
import { DigestPanel } from '@/components/DigestPanel';
import { HelpButton } from '@/components/HelpButton';
import { UserMenu } from '@/components/UserMenu';
import { RefreshButton } from '@/components/RefreshButton';
import { SuggestedFeedsButton } from '@/components/SuggestedFeedsButton';

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
          <HelpButton />
          <SuggestedFeedsButton />
          <RefreshButton />
          <DigestPanel />
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
          <StoryBrowser initialStories={stories} />
        </section>
      </main>
    </div>
  );
}
