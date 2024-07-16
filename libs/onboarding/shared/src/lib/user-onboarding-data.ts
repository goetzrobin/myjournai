import { z } from 'zod';

export const UserOnboardingDataSchema = z.object(
  {
    cohort: z.string(),
    gender_identity: z.string(),
    ethnicity: z.string(),
    ncaa_division: z.string(),
    graduation_year: z.number().min(2019).max(2025)
  });

export type UserOnboardingData = z.infer<typeof UserOnboardingDataSchema>
