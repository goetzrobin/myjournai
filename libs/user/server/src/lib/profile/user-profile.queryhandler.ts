import { db } from '~db/client';
import { desc, eq } from 'drizzle-orm';
import { OnboardingLetterQR } from '~myjournai/onboarding-shared';
import { onboardingLetters } from '~db/schema/onboarding-letters';
import { UserProfile, userProfiles } from '~db/schema/user-profiles';

export type OnboardingLetterQueryParams = { userId: string }
export const queryOnboardingLetterBy = async ({ userId }: OnboardingLetterQueryParams): Promise<OnboardingLetterQR | undefined> => {
  const [result] = await db.select().from(onboardingLetters).where(
    eq(onboardingLetters.userId, userId)
  ).limit(1);
  return result;
};

export type UserProfileQueryParams = { userId: string }
export const queryUserProfileBy = async ({ userId }: OnboardingLetterQueryParams): Promise<UserProfile | undefined> => {
  const [result] = await db.select().from(userProfiles).where(
    eq(userProfiles.userId, userId)
  ).orderBy(desc(userProfiles.createdAt)
  ).limit(1);
  return result;
};
