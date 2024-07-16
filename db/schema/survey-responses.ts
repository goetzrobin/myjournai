import {pgTable,timestamp, uuid} from "drizzle-orm/pg-core";
import {surveys} from "./surveys";
import {users} from "./users";
import {sessionLogs} from "./session-logs";

export const surveyResponses = pgTable('survey_responses', {
    id: uuid('id').defaultRandom().primaryKey(),
    user_id: uuid('user_id').notNull().references(() => users.id),
    survey_id: uuid('survey_id').notNull().references(() => surveys.id),
    session_log_id: uuid('session_log_id').references(() => sessionLogs.id),
    completed_at: timestamp('completed_at', {withTimezone: true}),
    created_at: timestamp('created_at', {withTimezone: true}).defaultNow(),
    updated_at: timestamp('updated_at', {withTimezone: true})
});

export type SurveyResponse = typeof surveyResponses.$inferSelect;
export type NewSurveyResponse = typeof surveyResponses.$inferInsert;
