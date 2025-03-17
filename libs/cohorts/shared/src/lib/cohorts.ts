import { z } from 'zod';
import { Cohort as CohortInternal } from '~db/schema/cohorts';

export type Cohort = CohortInternal;

export const cohortsQuerySchema = z.object({
  cursor: z.string().optional(), // Format: "ISO_DATE|slug" (createdAt timestamp|slug)
  limit: z.number().min(1).max(100).default(20),
  direction: z.enum(['forward', 'backward']).default('forward'),
});

export type CohortsQueryParams = z.infer<typeof cohortsQuerySchema>;

export type CohortsQueryResult = {
  items: Cohort[];
  hasMore: boolean;
  nextCursor: string | null;
};
