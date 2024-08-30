import { StartSessionCommand } from '~myjournai/session-shared';
import { SessionLog } from '~myjournai/sessionlog-shared';
import { db } from '~db/client';
import { sessionLogs } from '~db/schema/session-logs';

export const startSessionUseCase = async (command: StartSessionCommand): Promise<SessionLog> => {
  const now = new Date();
  const [insertedSessionLog] = await db.insert(sessionLogs).values({
    ...command,
    createdAt: now,
    startedAt: now
  }).returning();
  if (!insertedSessionLog) {
    console.error('something went wrong inserting session log');
  }
  return insertedSessionLog;
};
