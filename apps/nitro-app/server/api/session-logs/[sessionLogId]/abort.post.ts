import { abortSessionUseCase } from '~myjournai/session-server';
import { abortSessionCommandSchema } from '~myjournai/session-shared';

export default defineEventHandler(async (event) => {
  const sessionLogId = getRouterParam(event, 'sessionLogId');
  const userId = event.context.user?.id;

  const abortSessionCommand = abortSessionCommandSchema.safeParse({ sessionLogId, userId });
  if (abortSessionCommand.error) {
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      message: abortSessionCommand.error.message
    });
  }

  return await abortSessionUseCase(abortSessionCommand.data);
});
