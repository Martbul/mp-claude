//import "server-only"; //guarantees that you will get a build or at least runtime error if you put something from you server on the client

import {
  int,
  text,
  index,
  singlestoreTableCreator,
  bigint,
  timestamp
} from "drizzle-orm/singlestore-core";


export const createTable = singlestoreTableCreator(
  (name) => `mp_claude_${name}`,
)

export const files_table = createTable("files_table", {
  id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
  ownerId: text("owner_id").notNull(),
  name: text("name").notNull(),
  size: int("size").notNull(),
  url: text("url").notNull(),
  // fileKey: text("file_key").notNull(),
  parent: bigint("parent", { mode: "number", unsigned: true }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
},
  (t) => {
    return [
      index("parent_index").on(t.parent),
      index("owner_id_index").on(t.ownerId),
    ]
  },
)

export type DB_FileType = typeof files_table.$inferSelect

export const folders_table = createTable("folder_table", {
  id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
  ownerId: text("owner_id").notNull(),
  name: text("name").notNull(),
  parent: bigint("parent", { mode: "number", unsigned: true }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
},
  (t) => {
    return [index("parent_index").on(t.parent),
    index("owner_id_index").on(t.ownerId),]
  },
)


export type DB_FolderType = typeof folders_table.$inferSelect
