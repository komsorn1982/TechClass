CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"grade_level" integer NOT NULL,
	"semester" integer NOT NULL,
	"description" text NOT NULL,
	"lesson_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "learning_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"current_unit" integer DEFAULT 0 NOT NULL,
	"total_units" integer DEFAULT 12 NOT NULL,
	"last_path" text DEFAULT '/learn/1' NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lesson_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"course_code" text NOT NULL,
	"unit_number" integer NOT NULL,
	"lesson_hour" integer NOT NULL,
	"pre_correct" integer,
	"pre_total" integer DEFAULT 10 NOT NULL,
	"ability_group" text,
	"post_score" integer DEFAULT 0 NOT NULL,
	"post_max_score" integer DEFAULT 0 NOT NULL,
	"task_score" integer DEFAULT 0 NOT NULL,
	"task_max_score" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student_scores" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"course_code" text NOT NULL,
	"unit_number" integer NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"max_score" integer DEFAULT 10 NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" serial PRIMARY KEY NOT NULL,
	"auth_user_id" text NOT NULL,
	"email" text NOT NULL,
	"username" text NOT NULL,
	"password_hash" text NOT NULL,
	"password_salt" text NOT NULL,
	"student_code" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"grade_level" integer NOT NULL,
	"classroom" text NOT NULL,
	"avatar_key" text,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teacher_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"teacher_id" integer NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teachers" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"username" text NOT NULL,
	"password_hash" text NOT NULL,
	"password_salt" text NOT NULL,
	"avatar_key" text,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "learning_progress" ADD CONSTRAINT "learning_progress_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_results" ADD CONSTRAINT "lesson_results_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_scores" ADD CONSTRAINT "student_scores_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_sessions" ADD CONSTRAINT "teacher_sessions_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_courses_code" ON "courses" USING btree ("code");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_learning_progress_student_id" ON "learning_progress" USING btree ("student_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_lesson_results_student_course_hour" ON "lesson_results" USING btree ("student_id","course_code","lesson_hour");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_sessions_token_hash" ON "sessions" USING btree ("token_hash");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_student_scores_student_course_unit" ON "student_scores" USING btree ("student_id","course_code","unit_number");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_students_auth_user_id" ON "students" USING btree ("auth_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_students_email" ON "students" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_students_username" ON "students" USING btree ("username");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_students_grade_classroom_code" ON "students" USING btree ("grade_level","classroom","student_code");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_teacher_sessions_token_hash" ON "teacher_sessions" USING btree ("token_hash");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_teachers_username" ON "teachers" USING btree ("username");