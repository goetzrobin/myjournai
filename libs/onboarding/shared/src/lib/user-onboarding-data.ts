import { z } from 'zod';

export const UserOnboardingDataSchema = z.object(
  {
    cohort: z.string(),
    genderIdentity: z.string(),
    ethnicity: z.string(),
    ncaaDivision: z.string(),
    graduationYear: z.number().min(2010).max(2080)
  });

export type UserOnboardingData = z.infer<typeof UserOnboardingDataSchema>
