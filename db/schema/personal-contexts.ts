import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { users } from './users';

export const personalContexts = pgTable('personal_contexts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const selectPersonalContextSchema = createSelectSchema(personalContexts);
export const insertPersonalContextSchema = createInsertSchema(personalContexts);

export type PersonalContext = z.infer<typeof selectPersonalContextSchema>;
export type NewPersonalContext = z.infer<typeof insertPersonalContextSchema>;
