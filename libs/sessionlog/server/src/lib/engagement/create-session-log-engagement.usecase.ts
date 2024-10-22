import { db } from '~db/client';
import { z } from 'zod';
import { insertSessionLogEngagementSchema, sessionLogEngagements } from '~db/schema/session-log-engagements';
import { parseISO } from 'date-fns';

export const createSessionLogEngagementUseCase = async (data: CreateSessionLogEngagementCommand) => {
  console.log('data to insert is', data)
  return db.insert(sessionLogEngagements).values(data).returning();
};

export const createSessionLogEngagementCommandSchema =
  insertSessionLogEngagementSchema.extend({
  startedAt: z.string().datetime().transform(s => parseISO(s)),
  endedAt: z.string().datetime().transform(s => parseISO(s)),
})
export type CreateSessionLogEngagementCommand = z.infer<typeof createSessionLogEngagementCommandSchema>;
