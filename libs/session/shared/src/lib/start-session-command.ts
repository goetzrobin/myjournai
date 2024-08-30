import { z } from 'zod';
import { insertSessionLogSchema } from '~db/schema/session-logs';

export const startSessionCommandSchema = insertSessionLogSchema.pick({
  userId: true,
  sessionId: true,
  preFeelingScore: true,
  preMotivationScore: true,
  preAnxietyScore: true
});

export type StartSessionCommand = z.infer<typeof startSessionCommandSchema>;

