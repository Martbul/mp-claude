import { sql } from "drizzle-orm";
import {
  bigint,
  text,
  int,
  timestamp,
  json,
  boolean,
  double,
  index,
} from "drizzle-orm/singlestore-core";
import { createTable } from "./shared";
import type { FileTypeKey, StatusKey } from "./types";

export const documents_table = createTable("documents_table", {
  id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  size: int("size").notNull(),
  ownerId: text("owner_id").notNull(),
  url: text("url").notNull(),
  dateCreated: timestamp("date_created").notNull().defaultNow(),
  dateModified: timestamp("date_modified").notNull().defaultNow(),
  tags: json("tags").notNull().default([]),
  category: text("category").notNull(),
  isStarred: boolean("is_starred").notNull().default(false),
  isShared: boolean("is_shared").notNull().default(false),
  isLocked: boolean("is_locked").notNull().default(false),
  thumbnail: text("thumbnail"),
  description: text("description"),
  version: int("version").notNull().default(1),
  downloadCount: int("download_count").notNull().default(0),
  viewCount: int("view_count").notNull().default(0),
  aiProcessed: boolean("ai_processed").notNull().default(false),
  aiSummary: text("ai_summary"),
  aiTags: json("ai_tags").default([]),
  collaborators: json("collaborators").notNull().default([]),
  parentFolder: text("parent_folder"),
  path: text("path").notNull(),
  status: text("status").notNull().default("synced"),
  aiScore: double("ai_score"),
  readingTime: int("reading_time"),
  difficulty: text("difficulty"),
  subject: text("subject"),
  folderId: int("folder_id").default(sql`null`)
}, (t) => ({
  pathIndex: index("path_index").on(t.path),
  statusIndex: index("status_index").on(t.status),
  categoryIndex: index("category_index").on(t.category),
}));

export const document_folders_table = createTable("document_folders_table", {
  id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
  name: text("name").notNull(),
  color: text("color").notNull(),
  documentCount: int("document_count").notNull(),
  ownerId: text("owner_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => ({
  ownerIdIndex: index("owner_id_index").on(t.ownerId),
}));

export type DB_DocumentType = Omit<typeof documents_table.$inferSelect, "type" | "status"> & {
  type: FileTypeKey;
  status: StatusKey;
};

export type DB_DocumentFolderType = typeof document_folders_table.$inferSelect;
