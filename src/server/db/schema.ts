//import "server-only"; //guarantees that you will get a build or at least runtime error if you put something from you server on the client

import {
  int,
  text,
  index,
  singlestoreTableCreator,
  bigint,
  timestamp,
  json,
  boolean,
  double
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
  folder: text("folder"),
}, (t) => [
  index("owner_id_index").on(t.ownerId),
  index("folder_index").on(t.folder),
  index("category_index").on(t.category),
  index("updated_at_index").on(t.updatedAt),
])

export type DB_NoteType = typeof notes_table.$inferSelect

export const note_folders_table = createTable("note_folders_table", {
  id: text("id").primaryKey(), // e.g., "math-core"
  name: text("name").notNull(), // e.g., "Core Mathematics"
  color: text("color").notNull(), // e.g., "#2196F3"
  noteCount: int("note_count").notNull(), // e.g., 12
  ownerId: text("owner_id").notNull(), // assuming same as other tables
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [
  index("owner_id_index").on(t.ownerId),
]);

export type DB_NoteFolderType = typeof note_folders_table.$inferSelect;


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
},
  (t) => [
    index("owner_index").on(t.ownerId),
    index("date_index").on(t.date),
  ])




export const settings_table = createTable("settings_table", {
  id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
  userId: text("user_id").notNull(),

  // Profile
  name: text("name"),
  email: text("email"),
  phone: text("phone"),
  bio: text("bio"),
  institution: text("institution"),
  major: text("major"),
  graduationYear: text("graduation_year"),
  location: text("location"),
  timezone: text("timezone"),
  avatar: text("avatar"),

  // Appearance
  theme: text("theme").default("system"),
  accentColor: text("accent_color"),
  fontSize: text("font_size").default("medium"),
  compactMode: boolean("compact_mode").default(false),
  animations: boolean("animations").default(true),
  sidebarCollapsed: boolean("sidebar_collapsed").default(false),
  showAvatars: boolean("show_avatars").default(true),
  colorBlindMode: boolean("color_blind_mode").default(false),

  // Notifications (flat + nested)
  emailNotifications: boolean("email_notifications").default(true),
  pushNotifications: boolean("push_notifications").default(true),
  desktopNotifications: boolean("desktop_notifications").default(false),
  studyReminders: boolean("study_reminders").default(true),
  deadlineAlerts: boolean("deadline_alerts").default(true),
  collaborationUpdates: boolean("collaboration_updates").default(true),
  weeklyDigest: boolean("weekly_digest").default(true),
  marketingEmails: boolean("marketing_emails").default(false),
  soundEnabled: boolean("sound_enabled").default(true),
  vibrationEnabled: boolean("vibration_enabled").default(true),
  quietHours: json("quiet_hours"),

  // Privacy
  profileVisibility: text("profile_visibility").default("friends"),
  showOnlineStatus: boolean("show_online_status").default(true),
  allowDirectMessages: boolean("allow_direct_messages").default(true),
  shareStudyStats: boolean("share_study_stats").default(false),
  dataCollection: boolean("data_collection").default(true),
  analyticsOptIn: boolean("analytics_opt_in").default(true),
  twoFactorAuth: boolean("two_factor_auth").default(false),
  sessionTimeout: int("session_timeout").default(30),

  // AI
  aiAssistantEnabled: boolean("ai_assistant_enabled").default(true),
  autoSuggestions: boolean("auto_suggestions").default(true),
  smartNotifications: boolean("smart_notifications").default(true),
  learningAnalytics: boolean("learning_analytics").default(true),
  personalizedContent: boolean("personalized_content").default(true),
  voiceInteraction: boolean("voice_interaction").default(false),
  creativityLevel: int("creativity_level").default(70),
  responseLength: text("response_length").default("medium"),
  preferredLanguage: text("preferred_language").default("en"),
  contextAwareness: boolean("context_awareness").default(true),

  // Study
  defaultStudyDuration: int("default_study_duration").default(25),
  breakDuration: int("break_duration").default(5),
  longBreakInterval: int("long_break_interval").default(4),
  focusMode: boolean("focus_mode").default(true),
  backgroundSounds: boolean("background_sounds").default(false),
  pomodoroEnabled: boolean("pomodoro_enabled").default(true),
  goalTracking: boolean("goal_tracking").default(true),
  progressSharing: boolean("progress_sharing").default(false),
  studyStreaks: boolean("study_streaks").default(true),
  difficultyAdaptation: boolean("difficulty_adaptation").default(true),
  spacedRepetition: boolean("spaced_repetition").default(true),

  createdAt: timestamp("created_at").notNull().defaultNow(),
},
  (t) => [
    index("user_index").on(t.userId),
  ])


export type DB_SettingsType = typeof settings_table.$inferSelect;


export const documents_table = createTable("documents_table", {
  id: text("id").primaryKey(), // string ID like "1", from Date.now().toString()
  name: text("name").notNull(),
  type: text("type").notNull(), // e.g., pdf, docx, etc.
  size: int("size").notNull(),
  ownerId: text("owner_id").notNull(),

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

  status: text("status").notNull().default("synced"), // enum: synced, syncing, offline, error
  aiScore: double("ai_score"),
  readingTime: int("reading_time"),
  difficulty: text("difficulty"), // beginner, intermediate, advanced
  subject: text("subject"),
},
  (t) => {
    return [
      index("path_index").on(t.path),
      index("author_index").on(t.ownerId),
      index("status_index").on(t.status),
      index("category_index").on(t.category),
    ]
  }
)




