import { pgEnum, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { users } from './users';
import { sessionLogs } from './session-logs';

export const sessionLogEngagementEndReason = pgEnum('session_log_engagement_end_reason', ['SUCCESS', 'TIMEOUT']);

export const sessionLogEngagements = pgTable('session_log_engagements', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  sessionLogId: uuid('session_log_id').notNull().references(() => sessionLogs.id),
  endReason: sessionLogEngagementEndReason('end_reason').default('SUCCESS'),
  startedAt: timestamp('started_at', { withTimezone: true }),
  endedAt: timestamp('ended_at', { withTimezone: true })
});

export const selectSessionLogEngagementSchema = createSelectSchema(sessionLogEngagements);
export const insertSessionLogEngagementSchema = createInsertSchema(sessionLogEngagements);
export const updateSessionLogEngagementSchema = selectSessionLogEngagementSchema.omit({ id: true });

export type SessionLogEngagement = z.infer<typeof selectSessionLogEngagementSchema>;
export type NewSessionLogEngagement = z.infer<typeof insertSessionLogEngagementSchema>
export type UpdateSessionLogEngagement = z.infer<typeof updateSessionLogEngagementSchema>
