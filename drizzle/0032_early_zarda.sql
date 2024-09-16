DO $$ BEGIN
 CREATE TYPE "public"."message_run_end_reason" AS ENUM('SUCCESS', 'ERROR');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "message_runs" ADD COLUMN "end_reason" "message_run_end_reason" DEFAULT 'SUCCESS';