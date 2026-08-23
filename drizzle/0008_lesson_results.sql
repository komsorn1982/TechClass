CREATE TABLE `lesson_results` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`student_id` integer NOT NULL,
	`course_code` text NOT NULL,
	`unit_number` integer NOT NULL,
	`lesson_hour` integer NOT NULL,
	`pre_correct` integer,
	`pre_total` integer DEFAULT 10 NOT NULL,
	`ability_group` text,
	`post_score` integer DEFAULT 0 NOT NULL,
	`post_max_score` integer DEFAULT 0 NOT NULL,
	`task_score` integer DEFAULT 0 NOT NULL,
	`task_max_score` integer DEFAULT 0 NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_lesson_results_student_course_hour` ON `lesson_results` (`student_id`,`course_code`,`lesson_hour`);
