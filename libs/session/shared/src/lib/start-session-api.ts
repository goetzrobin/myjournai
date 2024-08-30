import { z } from 'zod';
import { startSessionCommandSchema } from './start-session-command';
import { SessionLog } from '~myjournai/sessionlog-shared';

export const startSessionRequestSchema = startSessionCommandSchema.pick({
  preFeelingScore: true,
  preMotivationScore: true,
  preAnxietyScore: true
});
export type StartSessionRequest = z.infer<typeof startSessionRequestSchema>
export type StartSessionResponse = SessionLog;
