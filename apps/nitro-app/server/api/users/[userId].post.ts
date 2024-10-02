import { updateUserUsecase } from '~myjournai/user-server';
import { userUpdateRequestSchema } from '~myjournai/user-shared';

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId');
  const parsedRequest =
    userUpdateRequestSchema.safeParse(await readBody(event));
  if (parsedRequest.error) {
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      message: parsedRequest.error.message
    });
  }
  if (userId !== event.context.user.id) {
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      message: 'User can only update their own data'
    });
  }
  return await updateUserUsecase(userId, parsedRequest.data);
});
