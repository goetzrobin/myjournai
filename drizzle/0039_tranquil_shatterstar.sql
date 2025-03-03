DO $$ BEGIN
 CREATE TYPE "public"."session_type" AS ENUM('GUIDED', 'UNGUIDED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "type" "session_type" DEFAULT 'GUIDED';