import { StartSessionCommand } from '~myjournai/session-shared';
import { SessionLog } from '~myjournai/sessionlog-shared';
import { db } from '~db/client';
import { sessionLogs } from '~db/schema/session-logs';
import { queryMostRecentSessionLogBy } from '~myjournai/sessionlog-server';

export const startSessionUseCase = async (command: StartSessionCommand): Promise<SessionLog> => {
  const now = new Date();
  const potentialMostRecentLogForSession = await queryMostRecentSessionLogBy({sessionId: command.sessionId, userId: command.userId, includeAborted: true});
  const version = potentialMostRecentLogForSession?.version === undefined ? 0 : ((potentialMostRecentLogForSession?.version ?? 0) + 1);
  const [insertedSessionLog] = await db.insert(sessionLogs).values({
    ...command,
    status: 'IN_PROGRESS',
    createdAt: now,
    startedAt: now,
    version,
  }).returning();
  if (!insertedSessionLog) {
    console.error('something went wrong inserting session log');
  }
  return insertedSessionLog;
};
