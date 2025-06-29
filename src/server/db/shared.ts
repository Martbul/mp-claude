import { singlestoreTableCreator } from "drizzle-orm/singlestore-core";

export const createTable = singlestoreTableCreator(
  (name) => `mp_claude_${name}`,
);
