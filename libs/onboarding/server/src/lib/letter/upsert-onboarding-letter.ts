import { db } from '~db/client';
import { eq } from 'drizzle-orm';
import { queryOnboardingLetterBy } from './onboarding-letter.queryhandler';
import { onboardingLetters } from '~db/schema/onboarding-letters';
import { UpsertOnboardingLetterRequest } from '~myjournai/onboarding-shared';

export const upsertOnboardingLetter = async (data: UpsertOnboardingLetterRequest) => {
  console.log(`[OnboardingLetter] Checking if letter exists for user ${data.userId}`);

  const existingLetter = await queryOnboardingLetterBy({ userId: data.userId });

  if (existingLetter) {
    console.log(`[OnboardingLetter] Updating existing letter for user ${data.userId}`);
    return db.update(onboardingLetters)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(onboardingLetters.id, existingLetter.id))
      .returning();
  }

  console.log(`[OnboardingLetter] Creating new letter for user ${data.userId}`);
  return db.insert(onboardingLetters)
    .values({ ...data })
    .returning();
};
