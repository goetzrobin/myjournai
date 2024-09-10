import { z } from 'zod';

export const abortSessionCommandSchema = z.object({ userId: z.string(), sessionLogId: z.string() });
export type AbortSessionCommand = z.infer<typeof abortSessionCommandSchema>;

