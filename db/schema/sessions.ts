import { integer, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug'),
  name: varchar('name'),
  description: text('description'),
  index: integer('index').notNull(),
  estimatedCompletionTime: integer('estimated_completion_time'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
});

export const selectSessionSchema = createSelectSchema(sessions);
export const insertSessionSchema = createInsertSchema(sessions);

export type Session = z.infer<typeof selectSessionSchema>;
export type NewSession = z.infer<typeof insertSessionSchema>
