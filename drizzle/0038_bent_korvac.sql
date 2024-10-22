DO $$ BEGIN
 CREATE TYPE "public"."session_log_engagement_end_reason" AS ENUM('SUCCESS', 'TIMEOUT');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session_log_engagements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"session_log_id" uuid NOT NULL,
	"end_reason" "session_log_engagement_end_reason" DEFAULT 'SUCCESS',
	"started_at" timestamp with time zone,
	"ended_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "competition_level" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session_log_engagements" ADD CONSTRAINT "session_log_engagements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session_log_engagements" ADD CONSTRAINT "session_log_engagements_session_log_id_session_logs_id_fk" FOREIGN KEY ("session_log_id") REFERENCES "public"."session_logs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
