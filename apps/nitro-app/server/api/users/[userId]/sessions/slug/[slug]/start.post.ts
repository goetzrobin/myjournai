import { getSessionBy, startSessionUseCase } from '~myjournai/session-server';
import { startSessionCommandSchema } from '~myjournai/session-shared';

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId');
  const slug = getRouterParam(event, 'slug');

  if (userId !== event.context.user.id) {
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      message: 'User can only start session for themselves'
    });
  }

  const body = await readBody(event);
  const session = await getSessionBy({ slug });
  if (!session) {
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid session slug.'
    });
  }

  const startSessionCommand = startSessionCommandSchema.safeParse({ userId, sessionId: session.id, ...body });

  if (startSessionCommand.error) {
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      message: startSessionCommand.error.message
    });
  }

  console.log('starting session', startSessionCommand)

  return await startSessionUseCase(startSessionCommand.data);
});
