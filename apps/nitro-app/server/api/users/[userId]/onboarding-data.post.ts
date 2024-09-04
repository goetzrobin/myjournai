import { createError, readBody } from 'h3';
import { UserOnboardingDataSchema } from '~myjournai/onboarding-shared';
import { updateUserOnboardingCommand } from '~myjournai/onboarding-server';

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId');
  const body = await readBody(event)
  const parsedRequest = UserOnboardingDataSchema.safeParse(body);
  if (parsedRequest.error) {
    console.error('failed to parse body', body, parsedRequest.error.message)
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      message: parsedRequest.error.message
    });
  }
  await updateUserOnboardingCommand(userId, parsedRequest.data);
  return parsedRequest;
});
