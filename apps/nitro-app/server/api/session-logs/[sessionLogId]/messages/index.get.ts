import { querySessionLogMessagesBy } from '~myjournai/sessionlog-server';

export default eventHandler(async (event) => {
  const sessionLogId = getRouterParam(event, 'sessionLogId');
  if (!sessionLogId) {
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      message: 'Need to provide a sessionLogId'
    });
  }
  const results = await querySessionLogMessagesBy({ sessionLogId });
  if (results.length > 0 && results[0].userId !== event.context.user?.id) {
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      message: 'Can only request messages for yourself'
    });
  }
  return results;
});
