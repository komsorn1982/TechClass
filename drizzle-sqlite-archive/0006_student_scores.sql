CREATE TABLE `student_scores` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`student_id` integer NOT NULL,
	`course_code` text NOT NULL,
	`unit_number` integer NOT NULL,
	`score` integer DEFAULT 0 NOT NULL,
	`max_score` integer DEFAULT 10 NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_student_scores_student_course_unit` ON `student_scores` (`student_id`,`course_code`,`unit_number`);
