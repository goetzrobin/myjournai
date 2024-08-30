ALTER TABLE "cohorts" DROP CONSTRAINT "cohorts_name_unique";--> statement-breakpoint
ALTER TABLE "cohorts" ADD COLUMN "slug" text;--> statement-breakpoint
ALTER TABLE "cohorts" ADD CONSTRAINT "cohorts_slug_unique" UNIQUE("slug");