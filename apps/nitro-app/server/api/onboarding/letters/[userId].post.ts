import { createError } from 'h3';
import { upsertOnboardingLetter } from '~myjournai/onboarding-server';
import { upsertOnboardingLetterRequestSchema } from '~myjournai/onboarding-shared';


export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId');
  const parsedRequest = upsertOnboardingLetterRequestSchema.safeParse(await readBody(event));
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
      message: 'User can only create letter for themselves'
    });
  }
  const [letter] = await upsertOnboardingLetter(parsedRequest.data);
  return letter;
});
