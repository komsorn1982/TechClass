ALTER TABLE `students` ADD `username` text NOT NULL;--> statement-breakpoint
ALTER TABLE `students` ADD `password_hash` text NOT NULL;--> statement-breakpoint
ALTER TABLE `students` ADD `password_salt` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `idx_students_username` ON `students` (`username`);