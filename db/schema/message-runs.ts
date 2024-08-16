import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { users } from './users';
import { sessionLogs } from './session-logs';

export const messageRuns = pgTable('message_runs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  sessionLogId: uuid('session_log_id').notNull().references(() => sessionLogs.id),
  userMessage: text('user_message'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  finishedAt: timestamp('finished_at', { withTimezone: true })
});

export const selectMessageRunSchema = createSelectSchema(messageRuns);
export const insertMessageRunSchema = createInsertSchema(messageRuns);

export type MessageRun = z.infer<typeof selectMessageRunSchema>;
export type NewMessageRun = z.infer<typeof insertMessageRunSchema>
