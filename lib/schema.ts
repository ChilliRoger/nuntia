import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, index, unique } from "drizzle-orm/sqlite-core";

export const feeds = sqliteTable("feeds", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    url: text("url").notNull(),
    userId: text("user_id"), // Optional for guest mode or null for global
    title: text("title"),
    description: text("description"),
    siteUrl: text("siteUrl"),
    iconUrl: text("iconUrl"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
}, (t) => ({
    userUrlUnique: unique().on(t.url, t.userId),
}));

export const stories = sqliteTable("stories", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    guid: text("guid").notNull(),
    title: text("title").notNull(),
    link: text("link").notNull(),
    pubDate: integer("pub_date", { mode: "timestamp" }).notNull(),
    content: text("content"),
    author: text("author"),
    categories: text("categories"), // JSON array of category strings
    isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
    isSaved: integer("is_saved", { mode: "boolean" }).notNull().default(false),
    feedId: text("feed_id").notNull().references(() => feeds.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
}, (t) => ({
    feedGuidExcl: unique().on(t.feedId, t.guid),
    pubDateIdx: index("pub_date_idx").on(t.pubDate),
}));

// NEW: Daily Digest Reports table
export const reports = sqliteTable("reports", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id"),
    title: text("title").notNull(),
    content: text("content").notNull(), // Markdown content from LLM
    storyCount: integer("story_count").notNull(),
    model: text("model"), // Which Ollama model was used
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

export type Feed = typeof feeds.$inferSelect;
export type NewFeed = typeof feeds.$inferInsert;
export type Story = typeof stories.$inferSelect;
export type NewStory = typeof stories.$inferInsert;
export type Report = typeof reports.$inferSelect;
export type NewReport = typeof reports.$inferInsert;
