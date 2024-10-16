import { endSessionUseCase } from '~myjournai/session-server';
import { endSessionCommandSchema } from '~myjournai/session-shared';
import { useRuntimeConfig } from 'nitropack/runtime';

export default defineEventHandler(async (event) => {
  const sessionLogId = getRouterParam(event, 'sessionLogId');
  const userId = event.context.user?.id;
  const body = await readBody(event);
  const { openApiKey } = useRuntimeConfig(event);

  const endSessionCommand = endSessionCommandSchema.safeParse({ id: sessionLogId, apiKey: openApiKey, userId, ...body });
  if (endSessionCommand.error) {
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      message: endSessionCommand.error.message
    });
  }

  console.log('starting session', endSessionCommand);

  return await endSessionUseCase(endSessionCommand.data);
});
