import {pgTable,timestamp, uuid} from "drizzle-orm/pg-core";
import {surveys} from "./surveys";
import {users} from "./users";
import {sessionLogs} from "./session-logs";

export const surveyResponses = pgTable('survey_responses', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id),
    surveyId: uuid('survey_id').notNull().references(() => surveys.id),
    sessionLogId: uuid('session_log_id').references(() => sessionLogs.id),
    completedAt: timestamp('completed_at', {withTimezone: true}),
    createdAt: timestamp('created_at', {withTimezone: true}).defaultNow(),
    updatedAt: timestamp('updated_at', {withTimezone: true})
});

export type SurveyResponse = typeof surveyResponses.$inferSelect;
export type NewSurveyResponse = typeof surveyResponses.$inferInsert;
