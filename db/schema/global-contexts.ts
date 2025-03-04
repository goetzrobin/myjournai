import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const globalContexts = pgTable('global_contexts', {
  id: uuid('id').defaultRandom().primaryKey(),
  content: text('content').notNull(),
  weekNumber: integer('week_number').notNull(),
  year: integer('year').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const selectGlobalContextSchema = createSelectSchema(globalContexts);
export const insertGlobalContextSchema = createInsertSchema(globalContexts);

export type GlobalContext = z.infer<typeof selectGlobalContextSchema>;
export type NewGlobalContext = z.infer<typeof insertGlobalContextSchema>;
