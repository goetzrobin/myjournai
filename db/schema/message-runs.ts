import { pgEnum, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { users } from './users';
import { sessionLogs } from './session-logs';

export const messageRunEndReason = pgEnum('message_run_end_reason', ['SUCCESS', 'ERROR']);

export const messageRuns = pgTable('message_runs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  sessionLogId: uuid('session_log_id').notNull().references(() => sessionLogs.id),
  userMessage: text('user_message'),
  userMessageType: varchar('user_message_type'),
  userMessageScope: varchar('user_message_scope'),
  endReason: messageRunEndReason('end_reason').default('SUCCESS'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  finishedAt: timestamp('finished_at', { withTimezone: true })
});

export const selectMessageRunSchema = createSelectSchema(messageRuns);
export const insertMessageRunSchema = createInsertSchema(messageRuns);
export const messageRunEndReasonSchema = z.enum(messageRunEndReason.enumValues);


export type MessageRun = z.infer<typeof selectMessageRunSchema>;
export type NewMessageRun = z.infer<typeof insertMessageRunSchema>
export type MessageRunEndReason = z.infer<typeof messageRunEndReasonSchema>;
