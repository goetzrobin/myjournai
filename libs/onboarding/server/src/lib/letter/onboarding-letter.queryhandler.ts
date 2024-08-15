import { db } from '~db/client';
import { eq } from 'drizzle-orm';
import { OnboardingLetterQR } from '~myjournai/onboarding-shared';
import { onboardingLetters } from '~db/schema/onboarding-letters';

export type OnboardingLetterQueryParams = { userId: string }
export const queryOnboardingLetterBy = async ({ userId }: OnboardingLetterQueryParams): Promise<OnboardingLetterQR | undefined> => {
  const [result] = await db.select().from(onboardingLetters).where(
    eq(onboardingLetters.userId, userId)
  ).limit(1);
  return result;
};
