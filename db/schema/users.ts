import { date, integer, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: text('username').unique(),
  name: text('name'),
  pronouns: varchar('pronouns'),
  genderIdentity: text('gender_identity'),
  ethnicity: text('ethnicity'),
  competitionLevel: text('competition_level'),
  ncaaDivision: text('ncaa_division'),
  graduationYear: integer('graduation_year'),
  birthday: date('birthday'),
  referredBy: text('referred_by'),
  onboardingCompletedAt: timestamp('onboarding_completed_at', { withTimezone: true }),
  offboardingInitiated: timestamp('offboarding_initiated', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
});

export const selectUserSchema = createSelectSchema(users);
export const insertUserSchema = createInsertSchema(users);
export const updateUserSchema = selectUserSchema.omit({id: true});

export type User = z.infer<typeof selectUserSchema>;
export type NewUser = z.infer<typeof insertUserSchema>
export type UpdateUser = z.infer<typeof updateUserSchema>
