import "server-only"; //guarantees that you will get a build or at least runtime error if you put something from you server on the client

import {
  int,
  text,
  index,
  singlestoreTableCreator,
  bigint
} from "drizzle-orm/singlestore-core";


export const createTable = singlestoreTableCreator(
  (name) => `mp-claude_${name}`,
)

export const files_table = createTable("files_table", {
  id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
  name: text("name").notNull(),
  size: int("size").notNull(),
  url: text("url").notNull(),
  parent: bigint("parent", { mode: "number", unsigned: true }).notNull(),
},
  (t) => {
    return [index("parent_index").on(t.parent)]
  },
)

export const folders_table = createTable("folder_table", {
  id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
  name: text("name").notNull(),
  parent: bigint("parent", { mode: "number", unsigned: true }),
},
  (t) => {
    return [index("parent_index").on(t.parent)]
  },
)
