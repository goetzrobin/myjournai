import { getSessionsWithLogsBy } from '~myjournai/session-server';

const INTERNAL_USERS = ['tug29225@temple.edu', 'jnyquist@neurotrainer.com', jeff@neurotrainer.com'];
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
    isAdmin: (event.context.user?.email && INTERNAL_USERS.includes(event.context.user?.email))
  });
});
