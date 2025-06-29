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

  // Notifications
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
}, (t) => ({
  userIndex: index("user_index").on(t.userId),
}));

export type DB_SettingsType = typeof settings_table.$inferSelect;
