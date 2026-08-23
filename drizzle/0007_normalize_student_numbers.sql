DROP INDEX IF EXISTS `idx_students_student_code`;
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_students_grade_classroom_code` ON `students` (`grade_level`,`classroom`,`student_code`);
