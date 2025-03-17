import { z } from 'zod';
import { LocalContext as LocalContextInternal } from '~db/schema/local-contexts';

export type LocalContext = LocalContextInternal;

export const localContextsQuerySchema = z.object({
  cohortId: z.string().uuid(),
  cursor: z.string().optional(), // Format: "YYYY-WW" (year-weekNumber)
  limit: z.number().min(1).max(100).default(20),
  direction: z.enum(['forward', 'backward']).default('forward'),
  year: z.number().optional(), // Optional filter by year
  weekNumber: z.number().optional(), // Optional filter by week number
});

export type LocalContextsQueryParams = z.infer<typeof localContextsQuerySchema>;

export type LocalContextsQueryResult = {
  items: LocalContext[];
  hasMore: boolean;
  nextCursor: string | null;
};

export const upsertLocalContextSchema = z.object({
  cohortId: z.string().uuid(),
  content: z.string().min(1),
  weekNumber: z.number().min(1).max(53),
  year: z.number().min(2000).max(2100),
  id: z.string().uuid().optional(), // Optional for updates
});

export type UpsertLocalContextCommand = z.infer<typeof upsertLocalContextSchema>;

export interface LocalContextUpsertRequest extends UpsertLocalContextCommand {
  // Only has content and optional id, userId is added by the hook
}
