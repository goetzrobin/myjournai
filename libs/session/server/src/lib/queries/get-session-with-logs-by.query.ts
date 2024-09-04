import { SessionWithLogs } from '~myjournai/session-shared';
import { db } from '~db/client';
import { sessions } from '~db/schema/sessions';

export const getSessionsWithLogsBy = async ({ userId }: { userId: string }): Promise<SessionWithLogs[]> => {
  return db.query.sessions.findMany({
    orderBy: sessions.index,
    with: {
      logs: {
        where: (sessionLogs, { eq }) => eq(sessionLogs.userId, userId)
      }
    }
  });
};
