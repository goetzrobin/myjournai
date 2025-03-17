import { z } from 'zod';
import { GlobalContext as GlobalContextInternal } from '~db/schema/global-contexts';

export type GlobalContext = GlobalContextInternal;

export const globalContextsQuerySchema = z.object({
  cursor: z.string().optional(), // Format: "YYYY-WW" (year-weekNumber)
  limit: z.number().min(1).max(100).default(20),
  direction: z.enum(['forward', 'backward']).default('forward'),
  year: z.number().optional(), // Optional filter by year
  weekNumber: z.number().optional(), // Optional filter by week number
});

export type GlobalContextsQueryParams = z.infer<typeof globalContextsQuerySchema>;

export type GlobalContextsQueryResult = {
  items: GlobalContext[];
  hasMore: boolean;
  nextCursor: string | null;
};

export const upsertGlobalContextSchema = z.object({
  content: z.string().min(1),
  weekNumber: z.number().min(1).max(53),
  year: z.number().min(2000).max(2100),
  id: z.string().uuid().optional(), // Optional for updates
});

export type UpsertGlobalContextCommand = z.infer<typeof upsertGlobalContextSchema>;

export interface GlobalContextUpsertRequest extends UpsertGlobalContextCommand {
  // Only has content and optional id, userId is added by the hook
}
