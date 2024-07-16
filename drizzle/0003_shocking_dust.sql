DO $$ BEGIN
 CREATE TYPE "public"."cidi_survey_types" AS ENUM('PRE', 'POST');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "cidi_survey_responses" ADD COLUMN "type" "cidi_survey_types";