import { pgTable, text, timestamp, unique, uuid, varchar } from 'drizzle-orm/pg-core';
import { userInterestsCategories } from './user-interests-categories';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Topics Table
export const userInterests = pgTable('user_interests', {
  id: uuid('id').defaultRandom().primaryKey(),
  categoryId: uuid('user_interests_category_id').references(() => userInterestsCategories.id),
  name: varchar('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
});

export const userUserInterests = pgTable('user_user_interests', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  userInterestId: uuid('user_interest_id').references(() => userInterests.id).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
}, (table) => {
  return {
    // Ensure a user can't add the same topic twice
    uniqueUserTopic: unique().on(table.userId, table.userInterestId)
  };
});

export const userInterestsRelations = relations(userInterests, ({ one, many }) => ({
  category: one(userInterestsCategories, {
    fields: [userInterests.categoryId],
    references: [userInterestsCategories.id]
  }),
  userSelections: many(userUserInterests)
}));

export const selectUserInterestSchema = createSelectSchema(userInterests);
export type UserInterest = z.infer<typeof selectUserInterestSchema>;

