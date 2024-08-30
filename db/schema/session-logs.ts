import { integer, pgEnum, pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';
import { sessions } from './sessions';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { relations } from 'drizzle-orm';

export const sessionLogStatus = pgEnum('session_log_status', ['IN_PROGRESS', 'COMPLETED', 'ABORTED']);

export const sessionLogs = pgTable('session_logs', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id),
    sessionId: uuid('session_id').notNull().references(() => sessions.id),
    preFeelingScore: integer('pre_feeling_score'),
    preMotivationScore: integer('pre_motivation_score'),
    preAnxietyScore: integer('pre_anxiety_score'),
    postFeelingScore: integer('post_feeling_score'),
    postMotivationScore: integer('post_motivation_score'),
    postAnxietyScore: integer('post_anxiety_score'),
    version: integer('version').default(0),
    summary: text('summary'),
    status:
      sessionLogStatus('status').default('IN_PROGRESS'),
    startedAt: timestamp('started_at', { withTimezone: true }),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
  }, (t) => ({
    unq: unique().on(t.userId, t.sessionId, t.version)
  })
);


export const sessionLogRelations = relations(sessionLogs, ({ one }) => ({
  session: one(sessions, {
    fields: [sessionLogs.sessionId],
    references: [sessions.id]
  })
}));

export const selectSessionLogSchema = createSelectSchema(sessionLogs);
export const insertSessionLogSchema = createInsertSchema(sessionLogs);

export type SessionLog = z.infer<typeof selectSessionLogSchema>;
export type NewSessionLog = z.infer<typeof insertSessionLogSchema>
