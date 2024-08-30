import { z } from 'zod';
import { selectSessionLogSchema } from '~db/schema/session-logs';

export const endSessionCommandSchema = selectSessionLogSchema.pick({
  id: true,
  postFeelingScore: true,
  postMotivationScore: true,
  postAnxietyScore: true
}).and(z.object({ userId: z.string(), apiKey: z.string() }));

export type EndSessionCommand = z.infer<typeof endSessionCommandSchema>;

