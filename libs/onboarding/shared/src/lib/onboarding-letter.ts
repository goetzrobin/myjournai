import { NewOnboardingLetter, OnboardingLetter, updateOnboardingLetterSchema } from '~db/schema/onboarding-letters';

export type OnboardingLetterQR = OnboardingLetter;
export type UpsertOnboardingLetterRequest = NewOnboardingLetter;
export const upsertOnboardingLetterRequestSchema = updateOnboardingLetterSchema;
