import { z } from 'zod';
import { SessionLog } from '~myjournai/sessionlog-shared';
import { selectSessionLogSchema } from '~db/schema/session-logs';

export const endSessionRequestSchema = selectSessionLogSchema.pick({
  postFeelingScore: true,
  postMotivationScore: true,
  postAnxietyScore: true
});
export type EndSessionRequest = z.infer<typeof endSessionRequestSchema>
export type EndSessionResponse = SessionLog;
