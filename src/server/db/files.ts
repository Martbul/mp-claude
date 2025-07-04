import {
  bigint,
  text,
  int,
  timestamp,
  index,
} from "drizzle-orm/singlestore-core";
import { createTable } from "./shared";

export const files_table = createTable("files_table", {
  id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
  ownerId: text("owner_id").notNull(),
  name: text("name").notNull(),
  size: int("size").notNull(),
  url: text("url").notNull(),
  parent: bigint("parent", { mode: "number", unsigned: true }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => ({
  parentIndex: index("parent_index").on(t.parent),
  ownerIdIndex: index("owner_id_index").on(t.ownerId),
}));

export const folders_table = createTable("folder_table", {
  id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
  ownerId: text("owner_id").notNull(),
  name: text("name").notNull(),
  parent: bigint("parent", { mode: "number", unsigned: true }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => ({
  parentIndex: index("parent_index").on(t.parent),
  ownerIdIndex: index("owner_id_index").on(t.ownerId),
}));

export type DB_FileType = typeof files_table.$inferSelect;
export type DB_FolderType = typeof folders_table.$inferSelect;
