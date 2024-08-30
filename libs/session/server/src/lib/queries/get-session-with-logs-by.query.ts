import { SessionWithLogs } from '~myjournai/session-shared';
import { db } from '~db/client';

export const getSessionsWithLogsBy = async ({ userId }: { userId: string }): Promise<SessionWithLogs[]> => {
  return db.query.sessions.findMany({
    with: {
      logs: {
        where: (sessionLogs, { eq }) => eq(sessionLogs.userId, userId)
      }
    }
  });
};
