import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { users } from './users';

export const onboardingLetters = pgTable('onboarding_letters', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  content: text('content'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
});

export const selectOnboardingLetterSchema = createSelectSchema(onboardingLetters);
export const insertOnboardingLetterSchema = createInsertSchema(onboardingLetters);
export const updateOnboardingLetterSchema = selectOnboardingLetterSchema.omit({ id: true, createdAt: true, updatedAt: true });

export type OnboardingLetter = z.infer<typeof selectOnboardingLetterSchema>;
export type NewOnboardingLetter = z.infer<typeof insertOnboardingLetterSchema>
export type UpdateOnboardingLetter = z.infer<typeof updateOnboardingLetterSchema>
