import { pgTable, text, timestamp, unique, uuid, varchar } from 'drizzle-orm/pg-core';
import { users } from './users';
import { relations } from 'drizzle-orm';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const userMentorTraits = pgTable('user_mentor_traits', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
});

export const userUserMentorTraits = pgTable('user_user_mentor_traits', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  userMentorTraitId: uuid('user_mentor_trait_id').references(() => userMentorTraits.id).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
}, (table) => {
  return {
    // Ensure a user can't add the same trait twice
    uniqueUserTrait: unique().on(table.userId, table.userMentorTraitId)
  };
});

export const mentorTraitsRelations = relations(userMentorTraits, ({ many }) => ({
  userSelections: many(userUserMentorTraits)
}));

export const selectUserMentorTraitSchema = createSelectSchema(userMentorTraits);
export type UserMentorTrait = z.infer<typeof selectUserMentorTraitSchema>;
