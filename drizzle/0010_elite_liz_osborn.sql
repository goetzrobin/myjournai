ALTER TABLE "sessions" DROP CONSTRAINT "sessions_pre_survey_id_surveys_id_fk";
--> statement-breakpoint
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_post_survey_id_surveys_id_fk";
--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN IF EXISTS "pre_survey_id";--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN IF EXISTS "post_survey_id";

DROP TABLE "survey_question_responses";--> statement-breakpoint
DROP TABLE "survey_questions";--> statement-breakpoint
DROP TABLE "survey_responses";--> statement-breakpoint
DROP TABLE "surveys";--> statement-breakpoint
