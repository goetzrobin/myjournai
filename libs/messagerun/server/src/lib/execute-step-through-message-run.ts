import {
  createInitialMessage,
  createLLMProviders,
  CurrentStepInfo,
  executeStepNodeFactory,
  PromptProps,
  stepAnalyzerNodeFactory,
  StoreLLMInteractionArgs,
  streamFinalMessageNodeFactory,
  ToolProps
} from '~myjournai/chat-server';
import { queryUserInfoBlock, queryUserProfileBlock } from '@myjournai/user-server';
import {
  createEmbeddedQuestionsBlock,
  queryMostRecentSessionLogBy,
  querySessionLogMessagesBy
} from '~myjournai/sessionlog-server';
import { BaseMessage, BaseMessageChunk } from '~myjournai/chat-shared';
import { kv } from '@vercel/kv';
import { storeMessageRunUsecase } from './use-cases/store-message-run.usecase';
import { createError, createEventStream, H3Event, readBody } from 'h3';

export async function executeStepThroughMessageRun<Tools, AdditionalProps = {}>({
                                                                                  event,
                                                                                  sessionSlug,
                                                                                  maxSteps,
                                                                                  stepAnalyzerPrompt,
                                                                                  executeStepPromptsAndTools,
                                                                                  additionalAdjustFinalMessagePrompt,
                                                                                  fetchAdditionalPromptProps
                                                                                }: {
  event: H3Event;
  sessionSlug: string;
  maxSteps: number;
  stepAnalyzerPrompt: (messages: string, currentStep: CurrentStepInfo) => string;
  fetchAdditionalPromptProps?: ({userId}: {userId: string}) => Promise<AdditionalProps>;
  executeStepPromptsAndTools: Record<number, {
    tools: (props: ToolProps) => Tools;
    prompt: (props: PromptProps<AdditionalProps>) => string
  }>
  additionalAdjustFinalMessagePrompt?: string;
}) {
  const abortController = new AbortController();
  const body = await readBody(event);
  const eventStream = createEventStream(event);
  const userId = body.userId;

  if (!userId) {
    throw createError({
      status: 400,
      statusMessage: 'No userId passed in',
      message: 'Need userId to be passed in'
    });
  }

  const { openai, anthropic, groq } = createLLMProviders(event);
  console.log(`fetching user data and session log for userId ${userId} and session with slug ${sessionSlug}`);
  const [userInfoBlock, userProfileBlock, sessionLog] = await Promise.all([
    queryUserInfoBlock(userId),
    queryUserProfileBlock(userId),
    queryMostRecentSessionLogBy({ sessionSlug, userId })
  ]);

  if (!sessionLog) {
    throw createError({
      status: 500,
      statusMessage: 'Session Log does not exist yet',
      message: 'Before we can start a conversation a session log must be created'
    });
  }

  console.log(`session log exists. continuing with run and session log: ${JSON.stringify(sessionLog)}`);
  const sessionLogId = sessionLog.id as string;
  const runId = crypto.randomUUID();
  const runCreatedAt = new Date();
  const currentStepBySessionLogIdKey = `${sessionLogId}_current_step`;
  const messagesBySessionLogIdKey = `${sessionLogId}_messages`;

  const llmInteractionsToStore: StoreLLMInteractionArgs<any>[] = [];
  const additionalChunks: BaseMessageChunk[] = [];

  const additionalProps = await fetchAdditionalPromptProps?.({userId});

  const stepAnalyzerNode = stepAnalyzerNodeFactory({
    userId,
    runId,
    currentStepBySessionLogIdKey,
    messagesBySessionLogIdKey,
    stepAnalyzerPrompt,
    openai,
    abortController,
    maxSteps,
    llmInteractionsToStore
  });
  const executeStepNode = executeStepNodeFactory({
    userId,
    runId,
    currentStepBySessionLogIdKey,
    messagesBySessionLogIdKey,
    executeStepPromptsAndTools,
    groq,
    abortController,
    maxSteps,
    llmInteractionsToStore,
    userProfileBlock,
    userInfoBlock,
    embeddedQuestionsBlock: createEmbeddedQuestionsBlock(sessionLog),
    additionalChunks,
    additionalProps
  });
  const streamFinalMessageNode = streamFinalMessageNodeFactory({
    userId,
    runId,
    messagesBySessionLogIdKey,
    currentStepBySessionLogIdKey,
    anthropic,
    abortController,
    maxSteps,
    llmInteractionsToStore,
    userProfileBlock,
    userInfoBlock,
    additionalChunks,
    eventStream,
    additionalPrompt: additionalAdjustFinalMessagePrompt
  });

  console.log(`messages from previous runs retrieved from KV for key ${messagesBySessionLogIdKey}`);
  let messagesFromPreviousRuns: BaseMessage[] = [];

  const optionalCachedMessages = (await kv.get(messagesBySessionLogIdKey)) as BaseMessage[] | undefined;
  if (!optionalCachedMessages || optionalCachedMessages.length === 0) {
    messagesFromPreviousRuns = await querySessionLogMessagesBy({ sessionLogId });
    console.log('no cached messages. got messages from db for previous runs', messagesFromPreviousRuns);
  } else {
    console.log('messages cached, using those.');
    messagesFromPreviousRuns = optionalCachedMessages;
  }

  const initialMessage = createInitialMessage(body.type, body.scope, body.message);
  messagesFromPreviousRuns.push(initialMessage);

  await kv.set(messagesBySessionLogIdKey, messagesFromPreviousRuns);

  (async () => {
    try {
      console.log('starting graph execution');
      const messagesAfterAnalyzer = await stepAnalyzerNode(messagesFromPreviousRuns);
      const messagesAfterStepExecution = await executeStepNode(messagesAfterAnalyzer);
      const messagesAfterRun = await streamFinalMessageNode(messagesAfterStepExecution);
      console.log('completed graph execution');
      await kv.set(messagesBySessionLogIdKey, messagesAfterRun);
    } catch (e: unknown) {
      throw createError({
        status: 500,
        statusMessage: 'Something went wrong',
        message: JSON.stringify(e)
      });
    }
  })().then(async () => console.log('stream done'));

  eventStream.onClosed(async () => {
    console.log('stream closed aborting all llm calls');
    abortController.abort();
    console.log(`storing message run in db ${runId}`);
    await storeMessageRunUsecase({
      runCreatedAt,
      llmInteractionsToStore,
      sessionLogId,
      userId,
      runId,
      initialMessage
    });
    console.log(`finished storing message run in db ${runId}`);
  });

  console.log('sending stream');
  return eventStream.send();
}
