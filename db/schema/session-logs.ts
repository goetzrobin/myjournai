import {pgTable, integer, timestamp, uuid} from "drizzle-orm/pg-core";
import {users} from "./users";
import {sessions} from "./sessions";

export const sessionLogs = pgTable('session_logs', {
    id: uuid('id').defaultRandom().primaryKey(),
    voyager_id: uuid('voyager_id').notNull().references(() => users.id),
    session_id: uuid('session_id').notNull().references(() => sessions.id),
    index: integer('index').notNull(),
    started_at: timestamp('started_at', {withTimezone: true}),
    completed_at: timestamp('completed_at', {withTimezone: true}),
    created_at: timestamp('created_at', {withTimezone: true}).defaultNow(),
    updated_at: timestamp('updated_at', {withTimezone: true})
});

export type SessionLog = typeof sessionLogs.$inferSelect;
export type NewSessionLog = typeof sessionLogs.$inferInsert;