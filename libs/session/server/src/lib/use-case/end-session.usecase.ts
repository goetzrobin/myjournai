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


const generateConversationSummary = async ({ mostRecentConvoMessages, groqApiKey }: {
  mostRecentConvoMessages?: BaseMessage[];
  groqApiKey: string
}): Promise<string> => {
  const groq = createOpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: groqApiKey
  });
  const formattedMessages = formatMessages(mostRecentConvoMessages ?? []);
  const llm = groq('llama-3.1-70b-versatile');
  const result = await generateText({
    model: llm,
    prompt: `Give a concise and clear summary of the conversation. Make sure to focus on the value provided to the user and their state of mind
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
  const summary = await generateConversationSummary({mostRecentConvoMessages, groqApiKey: command.apiKey})

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
