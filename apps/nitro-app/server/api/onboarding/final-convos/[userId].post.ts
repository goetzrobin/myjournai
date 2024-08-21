import { createError, eventHandler } from 'h3';
import { getUserInfoBlock, getUserProfileBlock } from '@myjournai/user-server';
import { generateText, streamText, tool } from 'ai';
import { pushChunksToStream } from '~myjournai/utils-server';
import {
  createFinalMessageAugmentationPrompt,
  createInitialMessage,
  createLLMProviders,
  createStepAnalyzerPromptFactory,
  ensurePhoneLikeConversationFormatPrompt,
  filterOutInternalMessages,
  formatMessages,
  personaAndCommunicationStylePrompt,
  storeLlmInteraction,
  StoreLLMInteractionArgs
} from '~myjournai/chat-server';
import { z } from 'zod';
import { BaseMessage, BaseMessageType } from '~myjournai/chat-shared';
import { db } from '~db/client';
import { sessionLogs } from '~db/schema/session-logs';
import { and, desc, eq } from 'drizzle-orm';
import { sessions } from '~db/schema/sessions';
import { kv } from '@vercel/kv';
import { messageRuns } from '~db/schema/message-runs';
import { llmInteractions } from '~db/schema/llm-interactions';

const stepAnalyzerPrompt = createStepAnalyzerPromptFactory(({ currentStep }) =>
  `
${!(currentStep === 0 || currentStep === 1) ? '' : `
1. Introduction and Personality Exploration:
   - Criteria to Advance: AI has introduced itself and laid out protocol for next 4 weeks and  AI has made an insightful guess about the users personality and asked the user about it . User has responded. If met, increment step.
   - Criteria to Stay: AI has not fully introduced itself or user has asked more about next 4 weeks or AI has not yet made the guess.
`}
${!(currentStep === 1 || currentStep === 2) ? '' : `
2. Small Talk and Deeper Inquiry:
   - Criteria to Advance: AI has engaged in small talk and asked a deeper question about the user's motivations or values. User has responded. If met, increment step.
   - Criteria to Stay: AI has not yet asked a deeper question or user has not responded.
`}
${!(currentStep === 2 || currentStep === 3) ? '' : `
3. Gentle Transition to Close:
   - Criteria to Advance: AI has gently guided the conversation toward a close and mentioned the next session. If met, increment step.
   - Criteria to Stay: AI has not yet signaled the end of the conversation.
`}
${!(currentStep === 3 || currentStep === 4) ? '' : `
4. Call the Tool to End the Conversation:
   - Criteria to Advance: AI has completed all steps and confirmed the user is ready to end. If met, call the tool to end the conversation.
   - Criteria to Stay: AI has not confirmed readiness to end or has not called the tool.
`}
`);

const executeStepPromptsAndTools = {
  1: {
    tools: {}, prompt: (messages: string) => `
We are role playing. You are my mentor. Think of this situation like meeting a pen pal for the first time in a coffee shop.

${personaAndCommunicationStylePrompt}

Your only current objectives that you are dedicated to:
You need to introduce yourself, with your name, and very quickly tell them about what the two of you are going to do in the next 4 weeks:
you will explore potential careers outside sports together and have conversations that help them prepare for a fulfilling life after athletics,
because there's a chance that they soon will be done competing in the sport they have dedicated so much time to, but this is also a chance to explore
who they are as a person outside of athletics. Then, you take inspiration from the profile and combine that with the letter that the user wrote to introduce themselves
to really uncover some insightful guess about their personality. Take some risks here and try to uncover something truly new.
Don't play it save. Share this wild guess about their personality, using humor if appropriate.
You can take some risks because you also make sure they know you're only guessing.
You follow up your guess with a question along the lines: How close am I? Or maybe mix it up and ask something along the lines of:
What do you think, did I get this right? Most importantly, ensure this step is a genuinely fun and engaging experience while uncovering
at least one new insight to refine your athlete profile. Wait for their answer.

${ensurePhoneLikeConversationFormatPrompt}

Messages so far:
${messages}
`
  },
  2: {
    tools: {}, prompt: (messages: string) => `
We are role playing. You are my mentor. Think of this situation like meeting a pen pal for the first time in a coffee shop,
you just introduced yourself and took a wild guess about the users personality. Now you wanna get to know them a little better.
Keep it light and easy going

${personaAndCommunicationStylePrompt}

Your only current objectives that you are dedicated to:
After the user confirms your guess or denies it make a little small talk and learn about the user.
Ask a question that goes deeper into the motivations and values of the user.
Keep it to a couple messages, but ask a great question based on their interests or values.

${ensurePhoneLikeConversationFormatPrompt}

Messages so far:
${messages}
`
  },
  3: {
    tools: {
      endConversation: tool({
        description: 'End the conversation for the user',
        parameters: z.object({}),
        execute: async () => console.log('ending conversation!!!!')
      })
    }, prompt: (messages: string) => `
We are role playing. You are my mentor. Think of this situation like meeting a pen pal for the first time in a coffee shop,
you guys got to know each other a little more, but you also want to be mindful of their time.
They already spent a good amount of time answering questions and surveys and you want to keep it light and short and just let them know you're thankful.

${personaAndCommunicationStylePrompt}

Your only current objectives that you are dedicated to:
Gently guide the conversation to the end, by telling the user something along the lines of:
Alright, I don't wanna keep you too long, because I know you've already answered so many questions today.
I just wanted to say that I am excited to get to know you more over the next weeks and can't wait to get started!
I'll be right there for the next session. We're gonna talk a little more about athletic identity and the importance of knowing who you are outside of sports!

${ensurePhoneLikeConversationFormatPrompt}

Messages so far:
${messages}
`
  }
};

export default eventHandler(async (event) => {
  const abortController = new AbortController();
  const body = await readBody(event);
  const eventStream = createEventStream(event);
  const userId = getRouterParam(event, 'userId');
  const sessionSlug = 'onboarding-v0';
  const { openai, anthropic, groq } = createLLMProviders(event);

  console.log(`fetching user data and session log for userId ${userId} and session with slug ${sessionSlug}`);
  const [userInfo, userProfile, [sessionLog]] = await Promise.all([
    getUserInfoBlock(userId),
    getUserProfileBlock(userId),
    db.select()
      .from(sessionLogs)
      .innerJoin(sessions, eq(sessions.id, sessionLogs.sessionId))
      .where(
        and(
          eq(sessions.slug, sessionSlug),
          eq(sessionLogs.userId, userId)
        )
      ).orderBy(desc(sessionLogs.version))
      .limit(1)
  ]);

  if (!sessionLog) {
    throw createError({
      status: 500,
      statusMessage: 'Session Log does not exist yet',
      message: 'Before we can start a conversation a session log must be created'
    });
  }

  console.log('session log exists. continuing with run');
  const sessionLogId = sessionLog.session_logs.id;
  const runId = crypto.randomUUID();
  const runCreatedAt = new Date();
  const currentStepBySessionLogIdKey = `${sessionLogId}_current_step`;
  const messagesBySessionLogIdKey = `${sessionLogId}_messages`;

  const llmInteractionsToStore: StoreLLMInteractionArgs<any>[] = [];

  const stepAnalyzerNode = async (messages: BaseMessage[]): Promise<BaseMessage[]> => {
    const llmInteractionId = crypto.randomUUID();
    const type = 'analyzer';
    const scope = 'internal';
    const model = 'gpt-4o';
    const createdAt = new Date();

    let currentStep = (await kv.get(currentStepBySessionLogIdKey) ?? 1) as number;

    const messageString = formatMessages(filterOutInternalMessages((messages)));
    const prompt = stepAnalyzerPrompt(messageString, currentStep);

    const result = await generateText({
      model: openai(model),
      prompt,
      abortSignal: abortController.signal
    });

    if (result.text.trim() === 'advance') {
      currentStep += 1;
      if (currentStep === 9) {
        console.log('end conversation here');
      }
      console.log('incrementing current step to', currentStep);
    }

    messages.push({ id: llmInteractionId, type, scope, content: result.text, formatVersion: 1, createdAt });

    console.log(`determined current step ${currentStep} for ${currentStepBySessionLogIdKey}`);

    await kv.set(messagesBySessionLogIdKey, messages);
    await kv.set(currentStepBySessionLogIdKey, currentStep);
    llmInteractionsToStore.push({
      ...result,
      runId,
      userId,
      llmInteractionId,
      model,
      type,
      scope,
      createdAt,
      prompt
    });

    return messages;
  };
  const executeStepNode = async (messages: BaseMessage[]): Promise<BaseMessage[]> => {
    const llmInteractionId = crypto.randomUUID();
    const type = 'execute-step';
    const scope = 'internal';
    const model = 'llama-3.1-70b-versatile';
    const createdAt = new Date();

    let currentStep = (await kv.get(currentStepBySessionLogIdKey) ?? 1) as number;

    console.log(`executing current step ${currentStep}`);
    if (currentStep > 3) {
      console.warn('current step greater than available, resetting to max step 3');
      currentStep = 3;
    }

    const messageString = formatMessages(messages);
    const currentPromptAndTools = executeStepPromptsAndTools[currentStep];
    const currentPrompt = currentPromptAndTools.prompt ?? (() => '');
    const tools = currentPromptAndTools.tools ?? {};
    const prompt = currentPrompt(messageString, userInfo, userProfile);

    const result = await generateText({
      model: groq(model),
      prompt,
      tools,
      abortSignal: abortController.signal
    });

    messages.push({
      id: llmInteractionId,
      type,
      scope,
      content: result.text,
      formatVersion: 1,
      createdAt
    });

    await kv.set(messagesBySessionLogIdKey, messages);
    llmInteractionsToStore.push({
      ...result,
      runId,
      userId,
      llmInteractionId,
      model,
      type,
      scope,
      tools,
      createdAt,
      prompt
    });

    return messages;
  };
  const streamFinalMessageNode = async (messages: BaseMessage[]) => {
    const llmInteractionId = crypto.randomUUID();
    const model = 'claude-3-5-sonnet-20240620';
    const type = 'ai-message';
    const scope = 'external';
    const createdAt = new Date();

    const messageString = formatMessages(filterOutInternalMessages(messages.slice(messages.length - 5, messages.length)));
    const lastMessage = messages[messages.length - 1].content as string;
    const prompt = createFinalMessageAugmentationPrompt(messageString, lastMessage, userInfo, userProfile, `Remember the profile provided is just an initial profile and not verified yet. You will never mention that this profile exists to the user.`);

    const finalStream = await streamText({
      model: anthropic(model),
      prompt,
      abortSignal: abortController.signal,
      onFinish: result => {
        llmInteractionsToStore.push({
          ...result,
          runId,
          userId,
          llmInteractionId,
          model,
          type,
          scope,
          createdAt,
          prompt
        });
      }
    });
    const generatedMessage = await pushChunksToStream(llmInteractionId, runId, createdAt, eventStream, finalStream.fullStream, abortController);

    messages.push({
      id: llmInteractionId,
      scope,
      type,
      content: generatedMessage,
      formatVersion: 1,
      createdAt: new Date()
    });
    await kv.set(messagesBySessionLogIdKey, messages);
    return messages;
  };

  console.log(`messages from previous runs retrieved from KV for key ${messagesBySessionLogIdKey}`);
  let messagesFromPreviousRuns: BaseMessage[] = [];

  const optionalCachedMessages = (await kv.get(messagesBySessionLogIdKey)) as BaseMessage[] | undefined;
  if (!optionalCachedMessages || optionalCachedMessages.length === 0) {
    console.log('no cached messages, check DB if need to reconstruct existing messages');
    const existingIds = new Set<string>();
    const messagesFromDB: BaseMessage[] = [];

    (await db.select().from(messageRuns)
        .innerJoin(llmInteractions, eq(messageRuns.id, llmInteractions.messageRunId))
        .orderBy(messageRuns.createdAt, llmInteractions.createdAt)
    )
      .forEach(result => {
        const runId = result.message_runs.id;
        if (!existingIds.has(runId)) {
          // we are doing this because every run has a user message also that triggered the run
          existingIds.add(runId);
          messagesFromDB.push({
              id: runId,
              content: result.message_runs.userMessage,
              type: 'user-message' as BaseMessageType,
              scope: 'external',
              createdAt: result.message_runs.createdAt,
              formatVersion: 1
            }
          );
        }

        const interactionId = result.llm_interactions.id;
        existingIds.add(runId);
        messagesFromDB.push({
          id: interactionId,
          content: result.llm_interactions.generatedText,
          type: result.llm_interactions.type as BaseMessageType,
          scope: result.llm_interactions.scope,
          createdAt: result.llm_interactions.createdAt,
          formatVersion: 1
        });
      });
    messagesFromPreviousRuns = Array.from(messagesFromDB).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    console.log('messages from previous runs', messagesFromPreviousRuns);

  } else if (optionalCachedMessages.length > 0) {
    console.log('messages cached, using those.');
    messagesFromPreviousRuns = optionalCachedMessages;
  }

  const initialMessage = createInitialMessage(body.type, body.scope, body.message);
  messagesFromPreviousRuns.push(initialMessage);

  await kv.set(messagesBySessionLogIdKey, messagesFromPreviousRuns);

  (async () => {
    console.log('starting graph execution');
    const messagesAfterAnalyzer = await stepAnalyzerNode(messagesFromPreviousRuns);
    const messagesAfterStepExecution = await executeStepNode(messagesAfterAnalyzer);
    const messagesAfterRun = await streamFinalMessageNode(messagesAfterStepExecution);
    console.log('completed graph execution');
    await kv.set(messagesBySessionLogIdKey, messagesAfterRun);
  })().then(async () => {
    console.log(`storing message run in db ${runId}`);
    await db.insert(messageRuns).values({
      id: runId,
      userId,
      sessionLogId,
      userMessage: initialMessage.content,
      userMessageType: initialMessage.type,
      userMessageScope: initialMessage.scope,
      createdAt: runCreatedAt,
      finishedAt: new Date()
    });
    console.log(`run stored storing ${llmInteractionsToStore.length} interactions in db ${runId}`);
    for (const interaction of llmInteractionsToStore) {
      await storeLlmInteraction(interaction);
    }
  });

  eventStream.onClosed(async () => {
    console.log('stream closed aborting all llm calls');
    abortController.abort();
    await eventStream.push('[DONE]');
    await eventStream.close();
  });

  console.log('sending stream');
  return eventStream.send();
});
