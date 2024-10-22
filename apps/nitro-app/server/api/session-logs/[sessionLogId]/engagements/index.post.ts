import {
  createSessionLogEngagementCommandSchema,
  createSessionLogEngagementUseCase
} from '~myjournai/sessionlog-server';

export default defineEventHandler(async (event) => {
  const sessionLogId = getRouterParam(event, 'sessionLogId');
  const userId = event.context.user?.id;
  const body = await readBody(event);

  console.log('BODY IS', body)

  const abortSessionCommand = createSessionLogEngagementCommandSchema.safeParse({ ...body, sessionLogId, userId });
  if (abortSessionCommand.error) {
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      message: abortSessionCommand.error.message
    });
  }

  console.log('COMMAND IS', abortSessionCommand.data)

  return await createSessionLogEngagementUseCase(abortSessionCommand.data);
});
