CREATE TABLE `mp_claude_calendar_events_table` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`owner_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`date` text NOT NULL,
	`start_time` text,
	`end_time` text,
	`type` text NOT NULL,
	`priority` text NOT NULL DEFAULT 'medium',
	`location` text,
	`file_links` json,
	`recurring` text DEFAULT 'none',
	`reminder_minutes` int,
	`completed` boolean DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `mp_claude_calendar_events_table_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `owner_index` ON `mp_claude_calendar_events_table` (`owner_id`);--> statement-breakpoint
CREATE INDEX `date_index` ON `mp_claude_calendar_events_table` (`date`);--> statement-breakpoint
CREATE TABLE `mp_claude_documents_table` (
	`id` text NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`size` int NOT NULL,
	`owner_id` text NOT NULL,
	`date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`date_modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`tags` json NOT NULL DEFAULT '[]',
	`category` text NOT NULL,
	`is_starred` boolean NOT NULL DEFAULT false,
	`is_shared` boolean NOT NULL DEFAULT false,
	`is_locked` boolean NOT NULL DEFAULT false,
	`thumbnail` text,
	`description` text,
	`version` int NOT NULL DEFAULT 1,
	`download_count` int NOT NULL DEFAULT 0,
	`view_count` int NOT NULL DEFAULT 0,
	`ai_processed` boolean NOT NULL DEFAULT false,
	`ai_summary` text,
	`ai_tags` json DEFAULT '[]',
	`collaborators` json NOT NULL DEFAULT '[]',
	`parent_folder` text,
	`path` text NOT NULL,
	`status` text NOT NULL DEFAULT 'synced',
	`ai_score` double,
	`reading_time` int,
	`difficulty` text,
	`subject` text,
	CONSTRAINT `mp_claude_documents_table_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `path_index` ON `mp_claude_documents_table` (`path`);--> statement-breakpoint
CREATE INDEX `author_index` ON `mp_claude_documents_table` (`owner_id`);--> statement-breakpoint
CREATE INDEX `status_index` ON `mp_claude_documents_table` (`status`);--> statement-breakpoint
CREATE INDEX `category_index` ON `mp_claude_documents_table` (`category`);--> statement-breakpoint
CREATE TABLE `mp_claude_files_table` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`owner_id` text NOT NULL,
	`name` text NOT NULL,
	`size` int NOT NULL,
	`url` text NOT NULL,
	`parent` bigint unsigned NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `mp_claude_files_table_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `parent_index` ON `mp_claude_files_table` (`parent`);--> statement-breakpoint
CREATE INDEX `owner_id_index` ON `mp_claude_files_table` (`owner_id`);--> statement-breakpoint
CREATE TABLE `mp_claude_folder_table` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`owner_id` text NOT NULL,
	`name` text NOT NULL,
	`parent` bigint unsigned,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `mp_claude_folder_table_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `parent_index` ON `mp_claude_folder_table` (`parent`);--> statement-breakpoint
CREATE INDEX `owner_id_index` ON `mp_claude_folder_table` (`owner_id`);--> statement-breakpoint
CREATE TABLE `mp_claude_note_folders_table` (
	`id` text NOT NULL,
	`name` text NOT NULL,
	`color` text NOT NULL,
	`note_count` int NOT NULL,
	`is_expanded` boolean NOT NULL DEFAULT false,
	`owner_id` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `mp_claude_note_folders_table_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `owner_id_index` ON `mp_claude_note_folders_table` (`owner_id`);--> statement-breakpoint
CREATE TABLE `mp_claude_notes_table` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`owner_id` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`excerpt` text NOT NULL,
	`category` text,
	`tags` json NOT NULL,
	`color` text NOT NULL,
	`is_pinned` boolean NOT NULL DEFAULT false,
	`is_starred` boolean NOT NULL DEFAULT false,
	`is_bookmarked` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`author` text NOT NULL,
	`word_count` int NOT NULL,
	`reading_time` int NOT NULL,
	`priority` text NOT NULL DEFAULT 'medium',
	`status` text NOT NULL DEFAULT 'draft',
	`template` text,
	`linked_notes` json NOT NULL,
	`attachments` json NOT NULL,
	`collaborators` json NOT NULL,
	`ai_generated` boolean NOT NULL DEFAULT false,
	`ai_summary` text,
	`version` int NOT NULL DEFAULT 1,
	`is_shared` boolean NOT NULL DEFAULT false,
	`view_count` int NOT NULL DEFAULT 0,
	`folder` text,
	CONSTRAINT `mp_claude_notes_table_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `owner_id_index` ON `mp_claude_notes_table` (`owner_id`);--> statement-breakpoint
CREATE INDEX `folder_index` ON `mp_claude_notes_table` (`folder`);--> statement-breakpoint
CREATE INDEX `category_index` ON `mp_claude_notes_table` (`category`);--> statement-breakpoint
CREATE INDEX `updated_at_index` ON `mp_claude_notes_table` (`updated_at`);--> statement-breakpoint
CREATE TABLE `mp_claude_settings_table` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`name` text,
	`email` text,
	`phone` text,
	`bio` text,
	`institution` text,
	`major` text,
	`graduation_year` text,
	`location` text,
	`timezone` text,
	`avatar` text,
	`theme` text DEFAULT 'system',
	`accent_color` text,
	`font_size` text DEFAULT 'medium',
	`compact_mode` boolean DEFAULT false,
	`animations` boolean DEFAULT true,
	`sidebar_collapsed` boolean DEFAULT false,
	`show_avatars` boolean DEFAULT true,
	`color_blind_mode` boolean DEFAULT false,
	`email_notifications` boolean DEFAULT true,
	`push_notifications` boolean DEFAULT true,
	`desktop_notifications` boolean DEFAULT false,
	`study_reminders` boolean DEFAULT true,
	`deadline_alerts` boolean DEFAULT true,
	`collaboration_updates` boolean DEFAULT true,
	`weekly_digest` boolean DEFAULT true,
	`marketing_emails` boolean DEFAULT false,
	`sound_enabled` boolean DEFAULT true,
	`vibration_enabled` boolean DEFAULT true,
	`quiet_hours` json,
	`profile_visibility` text DEFAULT 'friends',
	`show_online_status` boolean DEFAULT true,
	`allow_direct_messages` boolean DEFAULT true,
	`share_study_stats` boolean DEFAULT false,
	`data_collection` boolean DEFAULT true,
	`analytics_opt_in` boolean DEFAULT true,
	`two_factor_auth` boolean DEFAULT false,
	`session_timeout` int DEFAULT 30,
	`ai_assistant_enabled` boolean DEFAULT true,
	`auto_suggestions` boolean DEFAULT true,
	`smart_notifications` boolean DEFAULT true,
	`learning_analytics` boolean DEFAULT true,
	`personalized_content` boolean DEFAULT true,
	`voice_interaction` boolean DEFAULT false,
	`creativity_level` int DEFAULT 70,
	`response_length` text DEFAULT 'medium',
	`preferred_language` text DEFAULT 'en',
	`context_awareness` boolean DEFAULT true,
	`default_study_duration` int DEFAULT 25,
	`break_duration` int DEFAULT 5,
	`long_break_interval` int DEFAULT 4,
	`focus_mode` boolean DEFAULT true,
	`background_sounds` boolean DEFAULT false,
	`pomodoro_enabled` boolean DEFAULT true,
	`goal_tracking` boolean DEFAULT true,
	`progress_sharing` boolean DEFAULT false,
	`study_streaks` boolean DEFAULT true,
	`difficulty_adaptation` boolean DEFAULT true,
	`spaced_repetition` boolean DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `mp_claude_settings_table_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `user_index` ON `mp_claude_settings_table` (`user_id`);