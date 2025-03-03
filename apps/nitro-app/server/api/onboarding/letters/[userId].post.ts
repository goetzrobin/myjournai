import { createError, H3Event } from 'h3';
import { upsertOnboardingLetter } from '~myjournai/onboarding-server';
import { upsertOnboardingLetterRequestSchema } from '~myjournai/onboarding-shared';


export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId');
  console.log(`[OnboardingLetter] Received request for userId: ${userId}`);

  const parsedRequest = await validateRequest(event);

  if (userId !== parsedRequest.userId) {
    console.warn(`[OnboardingLetter] User ID mismatch: Request user ${parsedRequest.userId}, Context user ${event.context.user.id}`);
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      message: 'User can only create letter for themselves'
    });
  }

  console.log(`[OnboardingLetter] Upserting letter for user ${parsedRequest.userId}`);
  const [letter] = await upsertOnboardingLetter(parsedRequest);
  console.log(`[OnboardingLetter] Letter successfully upserted for user ${parsedRequest.userId}`);

  return letter;
});

const validateRequest = async (event: H3Event) => {
  const parsed = upsertOnboardingLetterRequestSchema.safeParse(await readBody(event));

  if (!parsed.success) {
    console.warn(`[OnboardingLetter] Validation failed: ${parsed.error.message}`);
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      message: parsed.error.message
    });
  }

  if (parsed.data.userId !== event.context.user.id) {
    console.warn(`[OnboardingLetter] Unauthorized attempt: userId ${parsed.data.userId} tried to act as ${event.context.user.id}`);
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      message: 'User can only create letter for themselves'
    });
  }

  return parsed.data;
};
