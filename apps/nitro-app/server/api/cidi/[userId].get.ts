import { defineEventHandler, getRouterParam } from 'h3';
import { queryUserPreAndPostSurveyResponsesBy } from '~myjournai/user-server'; // adjust import if using different framework

export default defineEventHandler(async (event) => {
  // Get userId from URL
  const userId = getRouterParam(event, 'userId');

  console.log(`[event-handler-api-cidi-userid-get] Processing request for survey data, userId: ${userId || 'undefined'}`);

  if (!userId) {
    console.warn(`[event-handler-api-cidi-userid-get] Missing userId parameter in request, returning 400`);
    return {
      statusCode: 400,
      body: 'Missing userId parameter'
    };
  }

  try {
    console.log(`[event-handler-api-cidi-userid-get] Retrieving survey data for userId: ${userId}`);

    const surveyData = await queryUserPreAndPostSurveyResponsesBy({ userId });

    console.log(`[event-handler-api-cidi-userid-get] Successfully retrieved survey data for userId: ${userId}, PRE: ${surveyData.pre ? 'present' : 'absent'}, POST: ${surveyData.post ? 'present' : 'absent'}`);

    // Return data with 200 status
    return surveyData;
  } catch (error) {
    console.error(`[event-handler-api-cidi-userid-get] Error retrieving survey data for userId: ${userId}`, error);

    // Log stack trace for debugging
    if (error instanceof Error && error.stack) {
      console.error(`[event-handler-api-cidi-userid-get] Stack trace:`, error.stack);
    }

    return {
      statusCode: 500,
      body: 'Error fetching survey responses'
    };
  }
});
