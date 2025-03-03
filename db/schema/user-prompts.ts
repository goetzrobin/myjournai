// Prompts Table
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const userPrompts = pgTable('user_prompts', {
  id: uuid('id').defaultRandom().primaryKey(),
  text: text('text').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
});

export const userPromptResponses = pgTable('user_prompt_responses', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  promptId: uuid('user_prompt_id').references(() => userPrompts.id).notNull(),
  content: text('content'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
});

export const selectUserPromptsSchema = createSelectSchema(userPrompts);
export type UserPrompt = z.infer<typeof selectUserPromptsSchema>;

export const selectUserPromptResponsesSchema = createSelectSchema(userPromptResponses);
export type UserPromptResponse = z.infer<typeof selectUserPromptResponsesSchema>;
