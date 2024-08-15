import { updateUserSchema } from '~db/schema/users';
import { z } from 'zod';

export const userUpdateRequestSchema = updateUserSchema.partial();
export type UserUpdateRequest = z.infer<typeof userUpdateRequestSchema>;
