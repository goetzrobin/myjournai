import { queryOnboardingLetterBy } from '~myjournai/onboarding-server';

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId');
  return await queryOnboardingLetterBy({ userId: userId });
});
