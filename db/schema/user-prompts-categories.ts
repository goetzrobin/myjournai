import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { userPrompts } from './user-prompts';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Categories Table
export const userPromptsCategories = pgTable('user_prompts_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
});

export const userPromptsCategoriesRelations = relations(userPromptsCategories, ({ many }) => ({
  topics: many(userPrompts)
}));

export const selectUserPromptsCategorySchema = createSelectSchema(userPromptsCategories);
export type UserPromptsCategory = z.infer<typeof selectUserPromptsCategorySchema>;
