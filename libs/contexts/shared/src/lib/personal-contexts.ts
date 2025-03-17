import { z } from 'zod';
import { PersonalContext as PersonalContextInternal } from '~db/schema/personal-contexts';

export type PersonalContext = PersonalContextInternal;

export const personalContextsQuerySchema = z.object({
  userId: z.string().uuid(),
  cursor: z.string().optional(), // ISO string date for created_at
  limit: z.number().min(1).max(100).default(20),
  direction: z.enum(['forward', 'backward']).default('forward'),
});
export type PersonalContextsQueryParams = z.infer<typeof personalContextsQuerySchema>;

export type PersonalContextsQueryResult = {
  items: PersonalContext[];
  hasMore: boolean;
  nextCursor: string | null;
};

// Simple command schema
export const upsertPersonalContextSchema = z.object({
  userId: z.string().uuid(),
  content: z.string().min(1),
  id: z.string().uuid().optional(), // Optional for updates
});
export type UpsertPersonalContextCommand = z.infer<typeof upsertPersonalContextSchema>;

export interface PersonalContextUpsertRequest extends UpsertPersonalContextCommand {
  // Only has content and optional id, userId is added by the hook
}
