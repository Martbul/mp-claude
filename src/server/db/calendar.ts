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

export const calendar_events_table = createTable("calendar_events_table", {
  id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
  ownerId: text("owner_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  date: text("date").notNull(),
  startTime: text("start_time"),
  endTime: text("end_time"),
  type: text("type").notNull(),
  priority: text("priority", { enum: ["low", "medium", "high"] }).notNull().default("medium"),
  location: text("location"),
  fileLinks: json("file_links"),
  recurring: text("recurring").default("none"),
  reminderMinutes: int("reminder_minutes"),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => ({
  ownerIndex: index("owner_index").on(t.ownerId),
  dateIndex: index("date_index").on(t.date),
}));

export type DB_CalendarrType = typeof calendar_events_table.$inferSelect;
