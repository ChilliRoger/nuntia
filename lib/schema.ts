import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, index, unique } from "drizzle-orm/sqlite-core";

export const feeds = sqliteTable("feeds", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    url: text("url").notNull().unique(),
    title: text("title"),
    description: text("description"),
    siteUrl: text("siteUrl"),
    iconUrl: text("iconUrl"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

export const stories = sqliteTable("stories", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    guid: text("guid").notNull(),
    title: text("title").notNull(),
    link: text("link").notNull(),
    pubDate: integer("pub_date", { mode: "timestamp" }).notNull(),
    content: text("content"),
    author: text("author"),
    isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
    isSaved: integer("is_saved", { mode: "boolean" }).notNull().default(false),
    feedId: text("feed_id").notNull().references(() => feeds.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
}, (t) => ({
    feedGuidExcl: unique().on(t.feedId, t.guid),
    pubDateIdx: index("pub_date_idx").on(t.pubDate),
}));

export type Feed = typeof feeds.$inferSelect;
export type NewFeed = typeof feeds.$inferInsert;
export type Story = typeof stories.$inferSelect;
export type NewStory = typeof stories.$inferInsert;
