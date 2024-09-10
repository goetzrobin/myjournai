import { db } from '~db/client';
import { sessionLogs } from '~db/schema/session-logs';
import { eq } from 'drizzle-orm';
import { createError } from 'h3';
import { AbortSessionCommand } from '~myjournai/session-shared';
import { SessionLog } from '~myjournai/sessionlog-shared';
import { querySessionLogBy } from '~myjournai/sessionlog-server';

export const abortSessionUseCase = async (command: AbortSessionCommand): Promise<SessionLog> => {
  const now = new Date();
  const { sessionLogId } = command;

  const sessionLogToUpdate = await querySessionLogBy({ id: sessionLogId });

  if (!sessionLogToUpdate) {
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid session log id.'
    });
  }

  if (sessionLogToUpdate.userId !== command.userId) {
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      message: 'User can only abort session for themselves'
    });
  }

  const [updatedSessionLog] = await db.update(sessionLogs).set({
    completedAt: now,
    updatedAt: now,
    status: 'ABORTED'
  }).where(eq(sessionLogs.id, sessionLogId)).returning();
  if (!updatedSessionLog) {
    console.error('something went wrong updating session log to aborted');
  }

  return updatedSessionLog;
};
