import { createOrUpdateUserCidiResponse, createUserCidiResponseRequestSchema } from '~myjournai/onboarding-server';
import { createError } from 'h3';

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId');
  const parsedRequest = createUserCidiResponseRequestSchema.safeParse(await readBody(event));
  if (parsedRequest.error) {
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      message: parsedRequest.error.message
    });
  }
  if (parsedRequest.data.userId !== event.context.user.id || userId !== parsedRequest.data.userId) {
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      message: 'User can only create response for themselves'
    });
  }
  return await createOrUpdateUserCidiResponse(parsedRequest.data);
});
