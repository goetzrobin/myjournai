DO $$ BEGIN
 CREATE TYPE "public"."llm_interaction_finish_reason" AS ENUM('stop', 'length', 'content-filter', 'tool-calls', 'error', 'other', 'unknown');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."llm_interaction_scope" AS ENUM('internal', 'external');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."session_log_status" AS ENUM('IN_PROGRESS', 'COMPLETED', 'ABORTED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "llm_interaction_tool_calls" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"llm_interaction_id" uuid NOT NULL,
	"index" integer DEFAULT 0,
	"name" varchar,
	"args" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "llm_interaction_warnings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"llm_interaction_id" uuid NOT NULL,
	"index" integer DEFAULT 0,
	"type" varchar,
	"setting" varchar,
	"details" text,
	"message" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "llm_interactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"message_run_id" uuid,
	"type" varchar,
	"scope" "llm_interaction_scope",
	"model" varchar,
	"prompt" text,
	"tools" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"finished_at" timestamp with time zone,
	"finish_reason" "llm_interaction_finish_reason",
	"generated_text" text,
	"raw_response" text,
	"prompt_tokens" integer,
	"completion_tokens" integer,
	"total_tokens" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "message_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"session_log_id" uuid NOT NULL,
	"user_message" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"finished_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "session_logs" ADD COLUMN "pre_feeling_score" integer;--> statement-breakpoint
ALTER TABLE "session_logs" ADD COLUMN "pre_motivation_score" integer;--> statement-breakpoint
ALTER TABLE "session_logs" ADD COLUMN "pre_anxiety_score" integer;--> statement-breakpoint
ALTER TABLE "session_logs" ADD COLUMN "post_feeling_score" integer;--> statement-breakpoint
ALTER TABLE "session_logs" ADD COLUMN "post_motivation_score" integer;--> statement-breakpoint
ALTER TABLE "session_logs" ADD COLUMN "post_anxiety_score" integer;--> statement-breakpoint
ALTER TABLE "session_logs" ADD COLUMN "version" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "session_logs" ADD COLUMN "status" "session_log_status" DEFAULT 'IN_PROGRESS';--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "llm_interaction_tool_calls" ADD CONSTRAINT "llm_interaction_tool_calls_llm_interaction_id_llm_interactions_id_fk" FOREIGN KEY ("llm_interaction_id") REFERENCES "public"."llm_interactions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "llm_interaction_warnings" ADD CONSTRAINT "llm_interaction_warnings_llm_interaction_id_llm_interactions_id_fk" FOREIGN KEY ("llm_interaction_id") REFERENCES "public"."llm_interactions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "llm_interactions" ADD CONSTRAINT "llm_interactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "llm_interactions" ADD CONSTRAINT "llm_interactions_message_run_id_message_runs_id_fk" FOREIGN KEY ("message_run_id") REFERENCES "public"."message_runs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "message_runs" ADD CONSTRAINT "message_runs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "message_runs" ADD CONSTRAINT "message_runs_session_log_id_session_logs_id_fk" FOREIGN KEY ("session_log_id") REFERENCES "public"."session_logs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "session_logs" DROP COLUMN IF EXISTS "index";--> statement-breakpoint
ALTER TABLE "session_logs" ADD CONSTRAINT "session_logs_session_id_version_unique" UNIQUE("session_id","version");