import { getSessionsWithLogsBy } from '~myjournai/session-server';

export default eventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId');
  if (userId !== event.context.user?.id) {
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      message: 'Can only get sessions for own user'
    });
  }
  return await getSessionsWithLogsBy({
    userId,
    isAdmin: (event.context.user?.email && ['tug29225@temple.edu'].includes(event.context.user?.email))
  });
});
