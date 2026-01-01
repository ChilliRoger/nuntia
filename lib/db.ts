import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";

// Serverless-compatible database initialization
function initializeDatabase() {
  try {
    // Check if we're in a serverless environment
    const isVercel = process.env.VERCEL === '1';
    const isServerless = isVercel || process.env.AWS_LAMBDA_FUNCTION_NAME;

    if (isServerless) {
      console.warn('⚠️ Running in serverless environment. SQLite will use /tmp directory (ephemeral).');
      console.warn('⚠️ Data will be lost between deployments. Consider using Turso or Postgres for production.');
    }

    // Use /tmp for serverless environments (ephemeral but writable)
    const dbPath = isServerless 
      ? join('/tmp', 'sqlite.db')
      : join(process.cwd(), 'sqlite.db');

    // Ensure directory exists
    const dbDir = isServerless ? '/tmp' : process.cwd();
    if (!existsSync(dbDir)) {
      mkdirSync(dbDir, { recursive: true });
    }

    console.log(`📁 Database path: ${dbPath}`);
    const sqlite = new Database(dbPath);
    
    // Enable WAL mode for better concurrency (if not in serverless)
    if (!isServerless) {
      sqlite.pragma('journal_mode = WAL');
    }
    
    const db = drizzle(sqlite, { schema });
    
    // Auto-create tables in serverless (since db is ephemeral anyway)
    if (isServerless) {
      try {
        sqlite.exec(`
          CREATE TABLE IF NOT EXISTS feeds (
            id TEXT PRIMARY KEY,
            url TEXT NOT NULL,
            user_id TEXT,
            title TEXT,
            description TEXT,
            siteUrl TEXT,
            iconUrl TEXT,
            created_at INTEGER NOT NULL DEFAULT (unixepoch()),
            updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
            UNIQUE(url, user_id)
          );

          CREATE TABLE IF NOT EXISTS stories (
            id TEXT PRIMARY KEY,
            guid TEXT NOT NULL,
            title TEXT NOT NULL,
            link TEXT NOT NULL,
            pub_date INTEGER NOT NULL,
            content TEXT,
            author TEXT,
            categories TEXT,
            is_read INTEGER NOT NULL DEFAULT 0,
            is_saved INTEGER NOT NULL DEFAULT 0,
            feed_id TEXT NOT NULL REFERENCES feeds(id) ON DELETE CASCADE,
            created_at INTEGER NOT NULL DEFAULT (unixepoch()),
            UNIQUE(feed_id, guid)
          );

          CREATE INDEX IF NOT EXISTS pub_date_idx ON stories(pub_date);

          CREATE TABLE IF NOT EXISTS reports (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            story_count INTEGER NOT NULL,
            model TEXT,
            created_at INTEGER NOT NULL DEFAULT (unixepoch())
          );
        `);
        console.log('✅ Database tables initialized');
      } catch (error) {
        console.error('Failed to initialize tables:', error);
      }
    }
    
    return db;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

export const db = initializeDatabase();
