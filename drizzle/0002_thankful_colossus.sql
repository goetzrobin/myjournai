CREATE TABLE IF NOT EXISTS "cidi_survey_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"question_1_0" integer,
	"question_1_1" integer,
	"question_1_2" integer,
	"question_1_3" integer,
	"question_1_4" integer,
	"question_1_5" integer,
	"question_1_6" integer,
	"question_1_7" integer,
	"question_2_0" integer,
	"question_2_1" integer,
	"question_2_2" integer,
	"question_2_3" integer,
	"question_2_4" integer,
	"question_3_1" integer,
	"question_3_2" integer,
	"question_3_3" integer,
	"question_3_4" integer,
	"question_3_5" integer,
	"question_4_0" integer,
	"question_4_1" integer,
	"question_4_2" integer,
	"question_5_0" integer,
	"question_5_1" integer,
	"question_5_2" integer,
	"question_5_3" integer,
	"question_5_4" integer,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "session_logs" RENAME COLUMN "voyager_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "survey_question_responses" RENAME COLUMN "voyager_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "survey_responses" RENAME COLUMN "voyager_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "session_logs" DROP CONSTRAINT "session_logs_voyager_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "survey_question_responses" DROP CONSTRAINT "survey_question_responses_voyager_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "survey_responses" DROP CONSTRAINT "survey_responses_voyager_id_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cidi_survey_responses" ADD CONSTRAINT "cidi_survey_responses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session_logs" ADD CONSTRAINT "session_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "survey_question_responses" ADD CONSTRAINT "survey_question_responses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "survey_responses" ADD CONSTRAINT "survey_responses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
