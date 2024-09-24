DO $$ BEGIN
 CREATE TYPE "public"."session_status" AS ENUM('DRAFT', 'ACTIVE', 'ARCHIVED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "status" "session_status" DEFAULT 'DRAFT';