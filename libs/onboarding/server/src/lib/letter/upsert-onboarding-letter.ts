import { db } from '~db/client';
import { eq } from 'drizzle-orm';
import { queryOnboardingLetterBy } from './onboarding-letter.queryhandler';
import { onboardingLetters } from '~db/schema/onboarding-letters';
import { UpsertOnboardingLetterRequest } from '~myjournai/onboarding-shared';

export const upsertOnboardingLetter = async (data: UpsertOnboardingLetterRequest) => {
  const existingLetter = await queryOnboardingLetterBy({ userId: data.userId });
  if (existingLetter) {
    return db.update(onboardingLetters).set({ ...data, updatedAt: new Date() }).where(eq(
      onboardingLetters.id, existingLetter.id)).returning();
  }
  return db.insert(onboardingLetters).values({ ...data }).returning();
};
