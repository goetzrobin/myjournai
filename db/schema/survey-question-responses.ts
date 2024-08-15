import {integer, pgTable, text, timestamp, uuid} from "drizzle-orm/pg-core";
import {users} from "./users";
import {surveyResponses} from "./survey-responses";
import {surveyQuestions} from "./survey-questions";

export const surveyQuestionResponses = pgTable('survey_question_responses', {
    id: uuid('id').defaultRandom().primaryKey(),
    user_id: uuid('user_id').notNull().references(() => users.id),
    surveyQuestionId: uuid('survey_question_id').notNull().references(() => surveyQuestions.id),
    surveyResponseId: uuid('survey_response_id').notNull().references(() => surveyResponses.id),
    stringValue: text('string_value'),
    numericValue: integer('numeric_value'),
    index: integer('index').notNull(),
    createdAt: timestamp('created_at', {withTimezone: true}).defaultNow(),
    updatedAt: timestamp('updated_at', {withTimezone: true})
});

export type SurveyQuestionResponse = typeof surveyQuestionResponses.$inferSelect;
export type NewSurveyQuestionResponse = typeof surveyQuestionResponses.$inferInsert;
