import { SessionWithLogs } from '~myjournai/session-shared';
import { db } from '~db/client';
import { sessions } from '~db/schema/sessions';
import { or } from 'drizzle-orm';

export const getSessionsWithLogsBy = async ({ userId, isAdmin }: { userId: string; isAdmin?: boolean }): Promise<SessionWithLogs[]> => {
  return db.query.sessions.findMany({
    orderBy: sessions.index,
    where: (sessions, { eq }) => or(eq(sessions.status, 'ACTIVE'), !isAdmin ? undefined : eq(sessions.status, 'DRAFT')),
    with: {
      logs: {
        where: (sessionLogs, { eq }) => eq(sessionLogs.userId, userId)
      }
    }
  });
};
