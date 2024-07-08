import {pgTable, integer, text, timestamp, varchar, uuid} from "drizzle-orm/pg-core";
import {surveys} from "./surveys";

export const sessions = pgTable('sessions', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name'),
    description: text('description'),
    index: integer('index').notNull(),
    estimated_completion_time: integer('estimated_completion_time'),
    pre_survey_id: uuid('pre_survey_id').references(() => surveys.id),
    post_survey_id: uuid('post_survey_id').references(() => surveys.id),
    created_at: timestamp('created_at', {withTimezone: true}).defaultNow(),
    updated_at: timestamp('updated_at', {withTimezone: true})
});

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;