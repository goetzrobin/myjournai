import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { userInterests } from './user-interests';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Categories Table
export const userInterestsCategories = pgTable('user_interests_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
});

export const userInterestsCategoriesRelations = relations(userInterestsCategories, ({ many }) => ({
  topics: many(userInterests)
}));

export const selectUserInterestsCategorySchema = createSelectSchema(userInterestsCategories);
export type UserInterestsCategory = z.infer<typeof selectUserInterestsCategorySchema>;
