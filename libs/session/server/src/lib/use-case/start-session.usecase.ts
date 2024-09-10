import { StartSessionCommand } from '~myjournai/session-shared';
import { SessionLog } from '~myjournai/sessionlog-shared';
import { db } from '~db/client';
import { sessionLogs } from '~db/schema/session-logs';
import { queryMostRecentSessionLogBy } from '~myjournai/sessionlog-server';

export const startSessionUseCase = async (command: StartSessionCommand): Promise<SessionLog> => {
  const now = new Date();
  const potentialMostRecentSession = await queryMostRecentSessionLogBy({userId: command.userId, includeAborted: true});
  const version = potentialMostRecentSession?.version === undefined ? undefined : ((potentialMostRecentSession?.version ?? 0) + 1);
  const [insertedSessionLog] = await db.insert(sessionLogs).values({
    ...command,
    createdAt: now,
    startedAt: now,
    version,
  }).returning();
  if (!insertedSessionLog) {
    console.error('something went wrong inserting session log');
  }
  return insertedSessionLog;
};
