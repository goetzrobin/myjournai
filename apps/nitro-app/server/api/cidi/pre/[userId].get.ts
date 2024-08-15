import { queryCidiSurveyResponsesBy } from '~myjournai/onboarding-server';

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId');
  return await queryCidiSurveyResponsesBy({ userId, type: 'PRE' });
});
