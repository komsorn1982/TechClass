CREATE TABLE `courses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`grade_level` integer NOT NULL,
	`semester` integer NOT NULL,
	`description` text NOT NULL,
	`lesson_count` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_courses_code` ON `courses` (`code`);--> statement-breakpoint
CREATE TABLE `students` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`auth_user_id` text NOT NULL,
	`email` text NOT NULL,
	`student_code` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`grade_level` integer NOT NULL,
	`classroom` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_students_auth_user_id` ON `students` (`auth_user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_students_email` ON `students` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_students_student_code` ON `students` (`student_code`);