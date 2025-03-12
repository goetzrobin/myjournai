import {
  createMentorTraitsBlock,
  createPromptResponsesBlock,
  createUserInterestsBlock,
  querytUserInterestsBy,
  queryUserMentorTraitsBy,
  queryUserPromptResponsesBy
} from '~myjournai/onboarding-server';

export const queryUserPersonalityBlock = async ({ userId }: { userId: string }) => {
  const [promptResponses, mentorTraits, userInterests] = await Promise.all([
    queryUserPromptResponsesBy({ userId }),
    queryUserMentorTraitsBy({ userId }),
    querytUserInterestsBy({ userId })
  ]);
  return `
  When tailoring your response you can leverage the following information that your mentee has shared about their personal interests, what they value in a mentor and when prompted the following questions:
Things they are interested in:
${createUserInterestsBlock(userInterests)}

Traits they value in a mentor:
${createMentorTraitsBlock(mentorTraits)}

Prompts and the answers they have given:
${createPromptResponsesBlock(promptResponses)}`;
};
