import { db } from '~db/client';
import { and, eq, inArray } from 'drizzle-orm';
import { UserPromptResponse, userPromptResponses } from '~db/schema/user-prompts';

export type PromptResponse = {
  promptId: string;
  content: string;
};

export type UpsertUserPromptResponsesCommand = {
  userId: string;
  responses: PromptResponse[];
};

/**
 * Inserts or updates a user's responses to prompts.
 * - For each response, checks if a response already exists for that user and prompt
 * - If it exists, updates the content
 * - If it doesn't exist, creates a new response
 *
 * @param command Object containing userId and array of prompt responses (promptId and content)
 * @returns Array of the updated/created response records
 * @throws Error if user ID is missing or responses is not an array
 */
export const upsertUserPromptResponsesUsecase = async ({
                                                         userId,
                                                         responses
                                                       }: UpsertUserPromptResponsesCommand): Promise<UserPromptResponse[]> => {
  // Validate inputs
  if (!userId) {
    throw new Error('User ID is required');
  }

  if (!Array.isArray(responses)) {
    throw new Error('Responses must be an array');
  }

  // Use a transaction to ensure data integrity
  return await db.transaction(async (tx) => {
    // Collect all promptIds to check
    const promptIds = responses.map(r => r.promptId);

    // Validate all promptIds are present
    if (promptIds.some(id => !id)) {
      throw new Error('Prompt ID is required for each response');
    }

    // Get all existing responses for this user and these prompts in a single query
    const existingResponses = await tx
      .select()
      .from(userPromptResponses)
      .where(
        and(
          eq(userPromptResponses.userId, userId),
          inArray(userPromptResponses.promptId, promptIds)
        )
      );

    const results = [];

    // Create a map for faster lookups
    const existingResponseByPromptId = existingResponses.reduce((prev, curr) => ({
      ...prev,
      [curr.promptId]: curr
    }), {} as Record<string, UserPromptResponse>)

    for (const response of responses) {
      const { promptId, content } = response;

      // Check if a response already exists for this prompt
      const existingResponse = existingResponseByPromptId[promptId];

      let result;

      if (existingResponse) {
        // Update existing response
        result = await tx
          .update(userPromptResponses)
          .set({
            content,
            updatedAt: new Date()
          })
          .where(eq(userPromptResponses.id, existingResponse.id))
          .returning();
      } else {
        // Create new response
        result = await tx
          .insert(userPromptResponses)
          .values({
            userId,
            promptId,
            content
          })
          .returning();
      }

      results.push(result[0]);
    }

    return results;
  });
};
