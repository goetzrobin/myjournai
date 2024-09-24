import { integer, pgEnum, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { relations } from 'drizzle-orm';
import { sessionLogs } from './session-logs';

export const sessionStatus = pgEnum('session_status', ['DRAFT', 'ACTIVE', 'ARCHIVED']);

export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug'),
  name: varchar('name'),
  description: text('description'),
  stepCount: integer('step_count'),
  imageUrl: varchar('image_url'),
  index: integer('index').notNull(),
  status: sessionStatus('status').default('DRAFT'),
  estimatedCompletionTime: integer('estimated_completion_time'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
});

export const sessionsRelations = relations(sessions, ({ many }) => ({
  logs: many(sessionLogs),
}));

export const selectSessionSchema = createSelectSchema(sessions);
export const insertSessionSchema = createInsertSchema(sessions);
export const sessionStatusSchema = z.enum(sessionStatus.enumValues);

export type Session = z.infer<typeof selectSessionSchema>;
export type NewSession = z.infer<typeof insertSessionSchema>
export type SessionStatus = z.infer<typeof sessionStatusSchema>;
