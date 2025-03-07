import { abortSessionUseCase } from '~myjournai/session-server';
import { abortSessionCommandSchema } from '~myjournai/session-shared';

export default defineEventHandler(async (event) => {
  const sessionLogId = getRouterParam(event, 'sessionLogId');
  const userId = event.context.user?.id;

  console.log(`[session-logs-sessionlogid-abort] Request to abort session ${sessionLogId} received from user ${userId}`);

  if (!userId) {
    console.warn(`[session-logs-sessionlogid-abort] Abort request rejected: No authenticated user`);
    throw createError({
      status: 401,
      statusMessage: 'Unauthorized',
      message: 'Must be logged in to abort session'
    });
  }

  const abortSessionCommand = abortSessionCommandSchema.safeParse({ sessionLogId, userId });

  if (!abortSessionCommand.success) {
    console.warn(`[session-logs-sessionlogid-abort] Invalid abort command: ${abortSessionCommand.error.message}`);
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      message: abortSessionCommand.error.message
    });
  }

  try {
    const result = await abortSessionUseCase(abortSessionCommand.data);
    console.log(`[session-logs-sessionlogid-abort] Successfully processed abort request for session ${sessionLogId}`);
    return result;
  } catch (error) {
    console.error(`[session-logs-sessionlogid-abort] Error while processing abort request: ${error.message}`);
    throw error; // Rethrow to maintain original error
  }
});
