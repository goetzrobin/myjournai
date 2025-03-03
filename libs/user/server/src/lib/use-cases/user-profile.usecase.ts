import { db } from '~db/client';
import { NewUserProfile, UserProfile, userProfiles } from '~db/schema/user-profiles';
import { queryLatestUserProfileBy } from '../queries/user-profile.queries';
import { queryUserInfoBlock } from '../queries/query-user-info-block';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { createCidiResultsBlock, queryUserCidiSurveyResponsesBy } from '../queries/user-cidi.queries';
import { BaseMessage } from '~myjournai/chat-shared';
import { formatMessages } from '~myjournai/chat-server';
import {
  createMentorTraitsBlock,
  createPromptResponsesBlock,
  createUserInterestsBlock,
  querytUserInterestsBy,
  queryUserMentorTraitsBy,
  queryUserPromptResponsesBy
} from '~myjournai/onboarding-server';
import {
  aspirationsPrompt,
  coreValuesPrompt,
  currentStateOfMindPrompt,
  perceivedCareerReadinessPrompt
} from './user-profile.usecase.prompts';


export interface AdditionalProfileData {
  cidiResults: string;
  userInfo: string;
  promptsResponses: string;
  mentorTraits: string;
  userInterests: string;
  previousProfile?: UserProfile;
  mostRecentConvoMessages?: BaseMessage[];
}

const generateNewUserProfile = async ({
                                        userInfo,
                                        userId,
                                        apiKey,
                                        cidiResults,
                                        promptsResponses,
                                        mentorTraits,
                                        userInterests,
                                        previousProfile,
                                        mostRecentConvoMessages
                                      }: CreateUserProfileCommand & AdditionalProfileData): Promise<NewUserProfile> => {
  console.log(`[user-profile-generation] Starting profile generation for user ${userId}`);

  const formattedMessages = formatMessages(mostRecentConvoMessages ?? []);
  const openai = createOpenAI({ apiKey });
  const llm = openai('gpt-4o-mini');

  const promptData = {
    userInfo,
    cidiResults,
    previousProfile,
    promptsResponses,
    mentorTraits,
    userInterests,
    mostRecentConvoMessages: formattedMessages
  };

  console.log(`[user-profile-generation] Sending prompts to LLM in parallel...`);

  try {
    const [
      currentStateOfMind,
      perceivedCareerReadiness,
      coreValues,
      aspirations
    ] = await Promise.all([
      generateText({ model: llm, prompt: currentStateOfMindPrompt(promptData) }),
      generateText({ model: llm, prompt: perceivedCareerReadinessPrompt(promptData) }),
      generateText({ model: llm, prompt: coreValuesPrompt(promptData) }),
      generateText({ model: llm, prompt: aspirationsPrompt(promptData) })
    ]);

    console.log(`[user-profile-generation] All profile sections generated for user ${userId}`);

    return {
      userId,
      currentStateOfMind: currentStateOfMind.text,
      perceivedCareerReadiness: perceivedCareerReadiness.text,
      coreValues: coreValues.text,
      aspirations: aspirations.text
    };
  } catch (error) {
    console.error(`[user-profile-generation] Error generating profile for user ${userId}`, error);
    throw error;
  }
};


export type CreateUserProfileCommand = { userId: string; apiKey: string };

export const createUserProfileUsecase = async (command: CreateUserProfileCommand) => {
  console.log(`[user-profile-creation] Starting profile creation for user ${command.userId}`);

  try {
    const userId = command.userId;

    const queryResults = await Promise.all([
      queryUserCidiSurveyResponsesBy({ userId }),
      queryUserInfoBlock(userId),
      queryUserPromptResponsesBy({ userId }),
      queryUserMentorTraitsBy({ userId }),
      querytUserInterestsBy({ userId })
    ]);

    const [cidiResponse, userInfo, promptResponses, mentorTraits, userInterests] = queryResults;

    console.log(`[user-profile-creation] Data fetched for user ${userId}`);

    const newUserProfile = await generateNewUserProfile({
      ...command,
      userInfo,
      cidiResults: createCidiResultsBlock(cidiResponse),
      promptsResponses: createPromptResponsesBlock(promptResponses),
      mentorTraits: createMentorTraitsBlock(mentorTraits),
      userInterests: createUserInterestsBlock(userInterests)
    });

    console.log(`[user-profile-creation] Profile generated for user ${userId}`, newUserProfile);

    return db.insert(userProfiles).values(newUserProfile).returning();
  } catch (error) {
    console.error(`[user-profile-creation] Error creating profile for user ${command.userId}`, error);
    throw error;
  }
};

export type UpdateUserProfileCommand = CreateUserProfileCommand & {
  previousProfile?: UserProfile;
  mostRecentConvoMessages?: BaseMessage[];
};

export const recreateUserProfileUsecase = async (command: UpdateUserProfileCommand) => {
  console.log(`[user-profile-recreation] Starting profile recreation for user ${command.userId}`);

  try {
    const userId = command.userId;

    const queryResults = await Promise.all([
      queryUserCidiSurveyResponsesBy({ userId }),
      queryUserInfoBlock(userId),
      queryLatestUserProfileBy({ userId }),
      queryUserPromptResponsesBy({ userId }),
      queryUserMentorTraitsBy({ userId }),
      querytUserInterestsBy({ userId })
    ]);

    const [cidiResponse, userInfo, previousProfile, promptResponses, mentorTraits, userInterests] = queryResults;

    console.log(`[user-profile-recreation] Data fetched for user ${userId}`);

    const newUserProfile = await generateNewUserProfile({
      ...command,
      userInfo,
      previousProfile,
      cidiResults: createCidiResultsBlock(cidiResponse),
      promptsResponses: createPromptResponsesBlock(promptResponses),
      mentorTraits: createMentorTraitsBlock(mentorTraits),
      userInterests: createUserInterestsBlock(userInterests),
      mostRecentConvoMessages: command.mostRecentConvoMessages
    });

    console.log(`[user-profile-recreation] Profile regenerated for user ${userId}`, newUserProfile);

    return db.insert(userProfiles).values(newUserProfile).returning();
  } catch (error) {
    console.error(`[user-profile-recreation] Error recreating profile for user ${command.userId}`, error);
    throw error;
  }
};
