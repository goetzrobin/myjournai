import { db } from '~db/client';
import { sessionLogs } from '~db/schema/session-logs';
import { eq } from 'drizzle-orm';
import { createError } from 'h3';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { formatMessages } from '~myjournai/chat-server';
import { BaseMessage } from '~myjournai/chat-shared';
import { EndSessionCommand } from '~myjournai/session-shared';
import { SessionLog } from '~myjournai/sessionlog-shared';
import { recreateUserProfileUsecase } from '~myjournai/user-server';
import { querySessionLogBy, querySessionLogMessagesBy } from '~myjournai/sessionlog-server';


const generateConversationSummary = async ({ mostRecentConvoMessages, apiKey }: {
  mostRecentConvoMessages?: BaseMessage[];
  apiKey: string
}): Promise<string> => {
  const formattedMessages = formatMessages(mostRecentConvoMessages ?? []);
  const openai = createOpenAI({ apiKey });
  const llm = openai('gpt-4o-mini');
  const result = await generateText({
    model: llm,
    prompt: `You are an AI mentor designed to help users navigate complex and emotional topics.
    At the end of each conversation, provide a summary that is clear, concise, and empathetic.
    Capture the key points, advice given, and any important context, while also reflecting the emotional tone and nuances of the discussion.
    Your summary should evoke the warmth and understanding of the conversation, using a touch of humor where appropriate.
    It should help the user recall not just the facts, but the feeling of the exchange. Format the summary in short paragraphs using Markdown.

    Here are the messages of the conversation:
    ${formattedMessages}
    `
  });
  return result.text;
};

export const endSessionUseCase = async (command: EndSessionCommand): Promise<SessionLog> => {
  const now = new Date();
  const { id, ...commandWithoutId } = command;

  const sessionLogToUpdate = await querySessionLogBy({ id });

  if (!sessionLogToUpdate) {
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid session log id.'
    });
  }

  if (sessionLogToUpdate.userId !== command.userId) {
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      message: 'User can only end session for themselves'
    });
  }

  const mostRecentConvoMessages = await querySessionLogMessagesBy({ sessionLogId: command.id });
  const summary = await generateConversationSummary({mostRecentConvoMessages, apiKey: command.apiKey})

  const [updatedSessionLog] = await db.update(sessionLogs).set({
    ...commandWithoutId,
    completedAt: now,
    updatedAt: now,
    status: 'COMPLETED',
    summary
  }).where(eq(sessionLogs.id, id)).returning();
  if (!updatedSessionLog) {
    console.error('something went wrong updating session log');
  }

  await recreateUserProfileUsecase({
    userId: sessionLogToUpdate.userId,
    apiKey: command.apiKey,
    mostRecentConvoMessages
  });


  return updatedSessionLog;
};
