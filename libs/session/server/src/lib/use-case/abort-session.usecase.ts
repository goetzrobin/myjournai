import { db } from '~db/client';
import { sessionLogs } from '~db/schema/session-logs';
import { eq } from 'drizzle-orm';
import { createError } from 'h3';
import { AbortSessionCommand } from '~myjournai/session-shared';
import { SessionLog } from '~myjournai/sessionlog-shared';
import { querySessionLogBy } from '~myjournai/sessionlog-server';

export const abortSessionUseCase = async (command: AbortSessionCommand): Promise<SessionLog> => {
  const { sessionLogId, userId } = command;
  const now = new Date();

  console.log(`[abortSessionUseCase] Attempting to abort session ${sessionLogId} for user ${userId}`);

  const sessionLog = await querySessionLogBy({ id: sessionLogId });

  if (!sessionLog) {
    console.warn(`[abortSessionUseCase] Session abort failed: Invalid session log id ${sessionLogId}`);
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid session log id.'
    });
  }

  if (sessionLog.userId !== userId) {
    console.warn(`[abortSessionUseCase] Session abort failed: User ${userId} tried to abort session belonging to user ${sessionLog.userId}`);
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      message: 'User can only abort session for themselves'
    });
  }

  console.log(`[abortSessionUseCase] Updating session ${sessionLogId} status to ABORTED`);

  const [updatedSessionLog] = await db.update(sessionLogs)
    .set({
      completedAt: now,
      updatedAt: now,
      status: 'ABORTED'
    })
    .where(eq(sessionLogs.id, sessionLogId))
    .returning();

  if (!updatedSessionLog) {
    console.error(`[abortSessionUseCase] Failed to abort session ${sessionLogId} for user ${userId}`);
    throw createError({
      status: 500,
      statusMessage: 'Server Error',
      message: 'Failed to abort session'
    });
  }

  console.log(`[abortSessionUseCase] Successfully aborted session ${sessionLogId}`);
  return updatedSessionLog;
};
