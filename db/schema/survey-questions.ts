import {pgTable, text, timestamp, varchar, uuid, integer} from "drizzle-orm/pg-core";
import {surveys} from "./surveys";

export const surveyQuestions = pgTable('survey_questions', {
    id: uuid('id').defaultRandom().primaryKey(),
    surveyId: uuid('survey_id').notNull().references(() => surveys.id),
    question: varchar('question'),
    hint: text('hint'),
    type: varchar('type'),
    index: integer('index').notNull(),
    createdAt: timestamp('created_at', {withTimezone: true}).defaultNow(),
    updatedAt: timestamp('updated_at', {withTimezone: true})
});

export type SurveyQuestion = typeof surveyQuestions.$inferSelect;
export type NewSurveyQuestion = typeof surveyQuestions.$inferInsert;
