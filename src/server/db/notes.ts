import { sql } from "drizzle-orm";
import {
  bigint,
  text,
  int,
  timestamp,
  json,
  boolean,
  index,
} from "drizzle-orm/singlestore-core";
import { createTable } from "./shared";

export const notes_table = createTable("notes_table", {
  id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
  ownerId: text("owner_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  category: text("category"),
  tags: json("tags").notNull(),
  color: text("color").notNull(),
  isPinned: boolean("is_pinned").notNull().default(false),
  isStarred: boolean("is_starred").notNull().default(false),
  isBookmarked: boolean("is_bookmarked").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  author: text("author").notNull(),
  wordCount: int("word_count").notNull(),
  readingTime: int("reading_time").notNull(),
  priority: text("priority", { enum: ["low", "medium", "high"] }).notNull().default("medium"),
  status: text("status", { enum: ["draft", "in-progress", "completed", "archived"] }).notNull().default("draft"),
  template: text("template"),
  linkedNotes: json("linked_notes").notNull(),
  attachments: json("attachments").notNull(),
  collaborators: json("collaborators").notNull(),
  aiGenerated: boolean("ai_generated").notNull().default(false),
  aiSummary: text("ai_summary"),
  version: int("version").notNull().default(1),
  isShared: boolean("is_shared").notNull().default(false),
  viewCount: int("view_count").notNull().default(0),
  folderId: bigint("folder_id", { mode: "number" }).default(sql`null`)
}, (t) => ({
  ownerIdIndex: index("owner_id_index").on(t.ownerId),
  folderIndex: index("folder_index").on(t.folderId),
  categoryIndex: index("category_index").on(t.category),
  updatedAtIndex: index("updated_at_index").on(t.updatedAt),
}));

export const note_folders_table = createTable("note_folders_table", {
  id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
  name: text("name").notNull(),
  color: text("color").notNull(),
  noteCount: int("note_count").notNull(),
  ownerId: text("owner_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => ({
  ownerIdIndex: index("owner_id_index").on(t.ownerId),
}));

export type DB_NoteType = typeof notes_table.$inferSelect;
export type DB_NoteFolderType = typeof note_folders_table.$inferSelect;
