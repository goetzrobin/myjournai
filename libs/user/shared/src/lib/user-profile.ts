import { z } from 'zod';

export const userProfileCreateRequestSchema = z.object({
  userId: z.string(),
});
export type UserProfileCreateRequest = z.infer<typeof userProfileCreateRequestSchema>;
