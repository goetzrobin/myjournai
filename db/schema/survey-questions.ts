import {pgTable, text, timestamp, varchar, uuid, integer} from "drizzle-orm/pg-core";
import {surveys} from "./surveys";

export const surveyQuestions = pgTable('survey_questions', {
    id: uuid('id').defaultRandom().primaryKey(),
    survey_id: uuid('survey_id').notNull().references(() => surveys.id),
    question: varchar('question'),
    hint: text('hint'),
    type: varchar('type'),
    index: integer('index').notNull(),
    created_at: timestamp('created_at', {withTimezone: true}).defaultNow(),
    updated_at: timestamp('updated_at', {withTimezone: true})
});

export type SurveyQuestion = typeof surveyQuestions.$inferSelect;
export type NewSurveyQuestion = typeof surveyQuestions.$inferInsert;