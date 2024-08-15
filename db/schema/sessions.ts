import {pgTable, integer, text, timestamp, varchar, uuid} from "drizzle-orm/pg-core";
import {surveys} from "./surveys";

export const sessions = pgTable('sessions', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name'),
    description: text('description'),
    index: integer('index').notNull(),
    estimatedCompletionTime: integer('estimated_completion_time'),
    preSurveyId: uuid('pre_survey_id').references(() => surveys.id),
    postSurveyId: uuid('post_survey_id').references(() => surveys.id),
    createdAt: timestamp('created_at', {withTimezone: true}).defaultNow(),
    updatedAt: timestamp('updated_at', {withTimezone: true})
});

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
