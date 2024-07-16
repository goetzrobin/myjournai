import { createOrUpdateUserCidiResponse, createUserCidiResponseRequestSchema } from '~myjournai/onboarding-server';
import { createError } from 'h3';

export default defineEventHandler(async (event) => {
  const parsedRequest = createUserCidiResponseRequestSchema.safeParse(await readBody(event));
  if (parsedRequest.error) {
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      message: parsedRequest.error.message
    });
  }
  if (parsedRequest.data.user_id !== event.context.user.id) {
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      message: 'User can only create response for themselves'
    });
  }
  return await createOrUpdateUserCidiResponse(parsedRequest.data);
});
