import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { users } from './users';

export const userProfiles = pgTable('user_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  currentStateOfMind: text('current_state_of_mind'),
  perceivedCareerReadiness: text('perceived_career_readiness'),
  coreValues: text('core_values'),
  aspirations: text('aspirations'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
});

export const selectUserProfileSchema = createSelectSchema(userProfiles);
export const insertUserProfileSchema = createInsertSchema(userProfiles);
export const updateUserProfileSchema = selectUserProfileSchema.omit({id: true});

export type UserProfile = z.infer<typeof selectUserProfileSchema>;
export type NewUserProfile = z.infer<typeof insertUserProfileSchema>
export type UpdateUserProfile = z.infer<typeof updateUserProfileSchema>
