import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { cohorts } from './cohorts';
import { z } from 'zod';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const localContexts = pgTable('local_contexts', {
  id: uuid('id').defaultRandom().primaryKey(),
  cohortId: uuid('cohort_id').notNull().references(() => cohorts.id),
  content: text('content').notNull(),
  weekNumber: integer('week_number').notNull(),
  year: integer('year').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const selectLocalContextSchema = createSelectSchema(localContexts);
export const insertLocalContextSchema = createInsertSchema(localContexts);

export type LocalContext = z.infer<typeof selectLocalContextSchema>;
export type NewLocalContext = z.infer<typeof insertLocalContextSchema>;


