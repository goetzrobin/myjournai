import { createError } from 'h3';
import { createOrUpdateUserCidiResponseUsecase, createUserCidiResponseCommandSchema } from '~myjournai/user-server';

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId');
  const parsedRequest = createUserCidiResponseCommandSchema.safeParse({...(await readBody(event) ?? {}), type: 'PRE'});
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
  return (await createOrUpdateUserCidiResponseUsecase(parsedRequest.data))[0];
});
