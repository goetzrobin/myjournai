import {integer, pgTable, text, timestamp, uuid} from "drizzle-orm/pg-core";
import {users} from "./users";
import {surveyResponses} from "./survey-responses";
import {surveyQuestions} from "./survey-questions";

export const surveyQuestionResponses = pgTable('survey_question_responses', {
    id: uuid('id').defaultRandom().primaryKey(),
    user_id: uuid('user_id').notNull().references(() => users.id),
    survey_question_id: uuid('survey_question_id').notNull().references(() => surveyQuestions.id),
    survey_response_id: uuid('survey_response_id').notNull().references(() => surveyResponses.id),
    string_value: text('string_value'),
    numeric_value: integer('numeric_value'),
    index: integer('index').notNull(),
    created_at: timestamp('created_at', {withTimezone: true}).defaultNow(),
    updated_at: timestamp('updated_at', {withTimezone: true})
});

export type SurveyQuestionResponse = typeof surveyQuestionResponses.$inferSelect;
export type NewSurveyQuestionResponse = typeof surveyQuestionResponses.$inferInsert;
