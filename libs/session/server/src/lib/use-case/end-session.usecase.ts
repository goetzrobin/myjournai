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

const SUMMARY_PROMPT = `You are a specialized AI designed to create concise, descriptive titles for "check-in" conversations between an AI mentor and a human mentee. Your task is to read through the conversation provided and generate a title that:
1. Succinctly captures both the primary personal situation AND the emotional state of the person
2. Is brief and kept to 1-3 sentences at most
3. Focuses specifically on what's happening in the person's life and how they feel about it
4. Uses clear, straightforward language that accurately describes their situation and emotional experience
5. Balances factual circumstances with emotional context
6. Avoids clinical or overly formal phrasing
7. If there is not enough data present to deduct a title simply return INCONCLUSIVE

## Input Format
The input will be a conversation between an AI mentor and a human mentee, with each speaker clearly labeled.

## Output Format
Your response should contain ONLY the title, with no additional explanation or commentary.

## Examples
For a conversation about a recent relationship ending:
"Heartbroken after 4.5-year relationship ends"

For a conversation about digital distractions:
"Frustrated by phone addiction struggles"

For a conversation about general life pressure:
"Overwhelmed by mounting life stressors"

For a conversation about job loss:
"Anxious uncertainty following unexpected layoff"

For a conversation about complicated feelings toward a former partner:
"Conflicted longing for ex-girlfriend"

Here are the messages:
    `;

const generateConversationSummary = async ({ messages, apiKey }: {
  messages?: BaseMessage[];
  apiKey: string
}): Promise<string> => {
  const msgs = messages ?? [];
  const formattedMessages = formatMessages(msgs);

  console.log(`generating summary for session-log messages=${msgs.length}`);

  const openai = createOpenAI({ apiKey });
  const llm = openai('gpt-4o-mini');

  const result = await generateText({
    model: llm,
    prompt: SUMMARY_PROMPT + formattedMessages
  });

  console.log(`summary generated chars=${result.text.length}`);
  return result.text.trim().replace(/['"]+/g, '');
};

export const endSessionUseCase = async (command: EndSessionCommand): Promise<SessionLog> => {
  const sessionLog = await querySessionLogBy({ id: command.id });
  if (!sessionLog) {
    console.error(`session-log not found id=${command.id} user=${command.userId}`);
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      message: 'invalid session log id'
    });
  }

  if (sessionLog.userId !== command.userId) {
    console.error(`session-log permission denied id=${command.id} requested_by=${command.userId} owned_by=${sessionLog.userId}`);
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      message: 'user can only end own session'
    });
  }

  const messages = await querySessionLogMessagesBy({
    sessionLogId: command.id
  });
  console.log(`session-log ending id=${command.id} user=${command.userId} messages=${messages.length}`);

  const [summary] = await Promise.all([
    generateConversationSummary({
      messages,
      apiKey: command.apiKey
    }),
    recreateUserProfileUsecase({
      userId: sessionLog.userId,
      apiKey: command.apiKey,
      mostRecentConvoMessages: messages
    })
  ]);

  const now = new Date();
  const { id, ...updateData } = command;

  console.log(`session-log updating id=${id} status=COMPLETED summary_length=${summary.length}`);

  const [updatedSessionLog] = await db.update(sessionLogs)
    .set({
      ...updateData,
      completedAt: now,
      updatedAt: now,
      status: 'COMPLETED',
      summary
    })
    .where(eq(sessionLogs.id, id))
    .returning();

  if (!updatedSessionLog) {
    console.error(`session-log update failed id=${id} user=${command.userId}`);
  } else {
    console.log(`session-log completed id=${id} user=${command.userId} summary="${summary.substring(0, 30)}..."`);
  }

  return updatedSessionLog;
};
