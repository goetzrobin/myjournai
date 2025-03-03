import { eq } from 'drizzle-orm';
import { db } from '~db/client';
import { userPromptResponses, userPrompts } from '~db/schema/user-prompts';
import { userMentorTraits, userUserMentorTraits } from '~db/schema/user-mentor-traits';
import { userInterests, userUserInterests } from '~db/schema/user-interests';

export interface UserPromptResponseQueryParams {
  userId: string;
}

export interface UserPromptResponse {
  text: string;
  content: string | null;
}

export const queryUserPromptResponsesBy = async ({
                                                   userId
                                                 }: UserPromptResponseQueryParams): Promise<UserPromptResponse[]> => {
  console.log(`[user-prompt-query] Fetching prompt responses for user ${userId}`);

  const query = db
    .select({
      text: userPrompts.text, // Get the question text
      content: userPromptResponses.content // Get the user's response
    })
    .from(userPromptResponses)
    .innerJoin(userPrompts, eq(userPromptResponses.promptId, userPrompts.id))
    .where(eq(userPromptResponses.userId, userId));

  // Get SQL and parameters for debugging
  const { sql, params } = query.toSQL();
  console.log(`[user-prompt-query] SQL: ${sql} | Params: ${JSON.stringify(params)}`);

  try {
    console.log(`[user-prompt-query] Executing database query...`);
    const results = await query.execute();

    console.log(`[user-prompt-query] Found ${results.length} responses for user ${userId}`);

    return results;
  } catch (error) {
    console.error(`[user-prompt-query] Error fetching responses for user ${userId}`, error);
    throw error; // Re-throw so caller can handle
  }
};

export interface UserMentorTraitQueryParams {
  userId: string;
}

export interface UserMentorTrait {
  name: string;
  description: string | null;
}

export const queryUserMentorTraitsBy = async ({
                                                userId
                                              }: UserMentorTraitQueryParams): Promise<UserMentorTrait[]> => {
  console.log(`[user-mentor-traits-query] Fetching mentor traits for user ${userId}`);

  const query = db
    .select({
      name: userMentorTraits.name,
      description: userMentorTraits.description
    })
    .from(userUserMentorTraits)
    .innerJoin(
      userMentorTraits,
      eq(userUserMentorTraits.userMentorTraitId, userMentorTraits.id)
    )
    .where(eq(userUserMentorTraits.userId, userId));

  const { sql, params } = query.toSQL();
  console.log(`[user-mentor-traits-query] SQL: ${sql} | Params: ${JSON.stringify(params)}`);

  try {
    console.log(`[user-mentor-traits-query] Executing database query...`);
    const results = await query.execute();

    console.log(`[user-mentor-traits-query] Found ${results.length} mentor traits for user ${userId}`);

    return results;
  } catch (error) {
    console.error(`[user-mentor-traits-query] Error fetching mentor traits for user ${userId}`, error);
    throw error;
  }
};


export interface UserInterestQueryParams {
  userId: string;
}

export interface UserInterest {
  name: string;
  description: string | null;
}

export const querytUserInterestsBy = async ({
                                              userId
                                            }: UserInterestQueryParams): Promise<UserInterest[]> => {
  console.log(`[user-interests-query] Fetching interests for user ${userId}`);

  const query = db
    .select({
      name: userInterests.name,
      description: userInterests.description
    })
    .from(userUserInterests)
    .innerJoin(
      userInterests,
      eq(userUserInterests.userInterestId, userInterests.id)
    )
    .where(eq(userUserInterests.userId, userId));

  const { sql, params } = query.toSQL();
  console.log(`[user-interests-query] SQL: ${sql} | Params: ${JSON.stringify(params)}`);

  try {
    console.log(`[user-interests-query] Executing database query...`);
    const results = await query.execute();

    console.log(`[user-interests-query] Found ${results.length} interests for user ${userId}`);

    return results;
  } catch (error) {
    console.error(`[user-interests-query] Error fetching interests for user ${userId}`, error);
    throw error;
  }
};


export const createPromptResponsesBlock = (promptResponses: UserPromptResponse[]) => {
  if (!promptResponses || promptResponses.length === 0) {
    return 'No prompt responses provided.';
  }

  return promptResponses.map(response => {
    const content = response.content ? `-"${response.content}"` : '-[No response provided]';
    return `PROMPT: "${response.text}"${content}`;
  }).join('\n');
};

export const createMentorTraitsBlock = (userTraits: UserMentorTrait[]) => {
  if (!userTraits || userTraits.length === 0) {
    return 'No mentor traits specified.';
  }

  return userTraits.map(trait => {
    const description = trait.description ? `: ${trait.description}` : '';
    return `- ${trait.name}${description}`;
  }).join('\n');
};

export const createUserInterestsBlock = (interests: UserInterest[]) => {
  if (!interests || interests.length === 0) {
    return 'No interests specified.';
  }

  return interests.map(interest => {
    const description = interest.description ? `: ${interest.description}` : '';
    return `- ${interest.name}${description}`;
  }).join('\n');
};
