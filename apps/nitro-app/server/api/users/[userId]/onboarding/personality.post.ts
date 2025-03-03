import { createError, defineEventHandler, getRouterParam, readBody } from 'h3';
import {
  PromptResponse,
  syncUserInterestsUsecase,
  syncUserMentorTraitsUsecase,
  upsertUserPromptResponsesUsecase
} from '~myjournai/onboarding-server';
import { z } from 'zod';
import { UserPromptResponse } from '~db/schema/user-prompts';
import { UserMentorTrait } from '~db/schema/user-mentor-traits';
import { UserInterest } from '~db/schema/user-interests';

// Define validation schema for the request body
const PersonalityDataSchema = z.object({
  promptResponses: z.array(z.object({
    promptId: z.string().uuid(),
    content: z.string()
  })),
  mentorTraits: z.array(z.string()),
  interests: z.array(z.string()),
});

export type PersonalityDataRequest = z.infer<typeof PersonalityDataSchema>;
export type PersonalityDataResponse = {
  promptResponses: UserPromptResponse[];
  mentorTraits: UserMentorTrait[];
  interests: UserInterest[];
};

export default defineEventHandler(async (event): Promise<PersonalityDataResponse> => {
  const userId = getRouterParam(event, 'userId');
  if (!userId) {
    console.warn('User ID is missing from request');
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      message: 'User ID is required'
    });
  }

  let body: unknown;
  try {
    body = await readBody(event);
  } catch (error) {
    console.error('Error reading request body', error);
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid request body'
    });
  }

  const parsedRequest = PersonalityDataSchema.safeParse(body);
  if (!parsedRequest.success) {
    console.warn('Validation failed for personality requestData request', parsedRequest.error.errors);
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid input requestData'
    });
  }

  const requestData: PersonalityDataRequest = parsedRequest.data;
  const response: PersonalityDataResponse = {
    promptResponses: [],
    mentorTraits: [],
    interests: [],
  };

  try {
    console.log('Processing personality requestData update for user:', userId);

    await Promise.all([
      upsertUserPromptResponsesUsecase({
        userId,
        responses: (requestData.promptResponses as PromptResponse[])
      }).then(result => response.promptResponses = result),

      syncUserMentorTraitsUsecase({
        userId,
        traitNames: requestData.mentorTraits
      }).then(result => response.mentorTraits = result),

      syncUserInterestsUsecase({
        userId,
        interestNames: requestData.interests
      }).then(result => response.interests = result)
    ]);

    console.log('Successfully updated personality requestData for user:', userId);
    return response;
  } catch (error) {
    console.error('Error updating personality requestData for user:', userId, error);
    throw createError({
      status: 500,
      statusMessage: 'Internal Server Error',
      message: 'An unexpected error occurred'
    });
  }
});
