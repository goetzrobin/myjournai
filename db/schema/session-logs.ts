import {pgTable, integer, timestamp, uuid} from "drizzle-orm/pg-core";
import {users} from "./users";
import {sessions} from "./sessions";

export const sessionLogs = pgTable('session_logs', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id),
    sessionId: uuid('session_id').notNull().references(() => sessions.id),
    index: integer('index').notNull(),
    startedAt: timestamp('started_at', {withTimezone: true}),
    completedAt: timestamp('completed_at', {withTimezone: true}),
    createdAt: timestamp('created_at', {withTimezone: true}).defaultNow(),
    updatedAt: timestamp('updated_at', {withTimezone: true})
});

export type SessionLog = typeof sessionLogs.$inferSelect;
export type NewSessionLog = typeof sessionLogs.$inferInsert;
