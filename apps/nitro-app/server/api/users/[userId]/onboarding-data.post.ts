import { queryUserBy } from '@myjournai/user-server';
import { createError, readBody } from 'h3';
import { UserOnboardingDataSchema } from '~myjournai/onboarding-shared';
import { updateUserOnboardingAction } from '~myjournai/onboarding-server';

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId');
  const parsedRequest = UserOnboardingDataSchema.safeParse(await readBody(event));
  if (parsedRequest.error) {
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      message: parsedRequest.error.message
    });
  }
  await updateUserOnboardingAction(userId, parsedRequest.data);
  return parsedRequest;
});
