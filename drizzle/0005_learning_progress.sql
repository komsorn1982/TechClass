CREATE TABLE `learning_progress` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`student_id` integer NOT NULL,
	`current_unit` integer DEFAULT 0 NOT NULL,
	`total_units` integer DEFAULT 12 NOT NULL,
	`last_path` text DEFAULT '/learn/1' NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_learning_progress_student_id` ON `learning_progress` (`student_id`);
