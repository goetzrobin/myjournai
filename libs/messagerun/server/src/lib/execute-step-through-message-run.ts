import {
  createInitialMessage,
  createLLMProviders,
  executeStepNodeFactory,
  getCurrentWeekAndYear,
  PromptProps,
  queryContextBlock,
  stepAnalyzerNodeFactory,
  StoreLLMInteractionArgs,
  streamFinalMessageNodeFactory,
  ToolProps
} from '~myjournai/chat-server';
import { queryUserInfoBlock, queryUserProfileBlock } from '~myjournai/user-server';
import {
  createEmbeddedQuestionsBlock,
  queryMostRecentSessionLogBy,
  querySessionLogMessagesBy
} from '~myjournai/sessionlog-server';
import { BaseMessage, BaseMessageChunk, CurrentStepInfo } from '~myjournai/chat-shared';
import { kv } from '@vercel/kv';
import { storeMessageRunUsecase } from './use-cases/store-message-run.usecase';
import { createError, createEventStream, H3Event, readBody } from 'h3';
import { MessageRunEndReason } from '~db/schema/message-runs';

export async function executeStepThroughMessageRun<Tools, AdditionalProps = {}>({
                                                                                  event,
                                                                                  sessionSlug,
                                                                                  maxSteps,
                                                                                  stepAnalyzerPrompt,
                                                                                  executeStepPromptsAndTools,
                                                                                  additionalAdjustFinalMessagePrompt,
                                                                                  fetchAdditionalPromptProps,
                                                                                  analyzerModel,
                                                                                  executeStepModel,
                                                                                  finalMessageModel
                                                                                }: {
  event: H3Event;
  sessionSlug: string;
  maxSteps: number;
  stepAnalyzerPrompt?: (messages: string, currentStep: CurrentStepInfo) => string;
  fetchAdditionalPromptProps?: ({ userId }: { userId: string }) => Promise<AdditionalProps>;
  executeStepPromptsAndTools: Record<number, {
    tools: (props: ToolProps) => Tools;
    prompt: (props: PromptProps<AdditionalProps>) => string
  }>
  additionalAdjustFinalMessagePrompt?: string;
  analyzerModel?: string;
  executeStepModel?: string;
  finalMessageModel?: string;
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

  const { anthropic } = createLLMProviders(event);
  const { weekNumber, year } = getCurrentWeekAndYear();
  console.log(`fetching user data and session log for userId ${userId} and session with slug ${sessionSlug}`);
  const [userInfoBlock, userProfileBlock, sessionLog, contextBlock] = await Promise.all([
    queryUserInfoBlock(userId),
    queryUserProfileBlock(userId),
    queryMostRecentSessionLogBy({ sessionSlug, userId }),
    queryContextBlock({ userId, weekNumber, year })
  ]);

  if (!sessionLog) {
    throw createError({
      status: 500,
      statusMessage: 'Session Log does not exist yet',
      message: 'Before we can start a conversation a session log must be created'
    });
  }

  console.log(`session log exists. continuing with run and session log: ${JSON.stringify(sessionLog)}`);
  let endReason: MessageRunEndReason = 'SUCCESS';
  const sessionLogId = sessionLog.id as string;
  const runId = crypto.randomUUID();
  const runCreatedAt = new Date();
  const currentStepBySessionLogIdKey = `${sessionLogId}_current_step`;
  const messagesBySessionLogIdKey = `${sessionLogId}_messages`;

  const llmInteractionsToStore: StoreLLMInteractionArgs<any>[] = [];
  const additionalChunks: BaseMessageChunk[] = [];

  const additionalProps = await fetchAdditionalPromptProps?.({ userId });

  let stepAnalyzerNode: ((messages: BaseMessage[]) => Promise<BaseMessage[]>) | undefined = undefined;
  if (stepAnalyzerPrompt) {
    stepAnalyzerNode = stepAnalyzerNodeFactory({
      userId,
      runId,
      currentStepBySessionLogIdKey,
      messagesBySessionLogIdKey,
      stepAnalyzerPrompt,
      anthropic,
      abortController,
      maxSteps,
      model: analyzerModel,
      llmInteractionsToStore
    });
  }
  const executeStepNode = executeStepNodeFactory({
    userId,
    runId,
    currentStepBySessionLogIdKey,
    messagesBySessionLogIdKey,
    executeStepPromptsAndTools,
    anthropic,
    abortController,
    maxSteps,
    llmInteractionsToStore,
    userProfileBlock,
    userInfoBlock,
    contextBlock,
    embeddedQuestionsBlock: createEmbeddedQuestionsBlock(sessionLog),
    additionalChunks,
    additionalProps,
    model: executeStepModel
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
    contextBlock,
    additionalChunks,
    eventStream,
    additionalPrompt: additionalAdjustFinalMessagePrompt,
    model: finalMessageModel
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
      const messagesAfterAnalyzer = stepAnalyzerNode === undefined ? messagesFromPreviousRuns : await stepAnalyzerNode(messagesFromPreviousRuns);
      const messagesAfterStepExecution = await executeStepNode(messagesAfterAnalyzer);
      const messagesAfterRun = await streamFinalMessageNode(messagesAfterStepExecution);
      console.log('completed graph execution');
      await kv.set(messagesBySessionLogIdKey, messagesAfterRun);
    } catch (e: any) {
      endReason = 'ERROR';
      console.error(e);

      const errorChunk: BaseMessageChunk = {
        scope: 'internal',
        chunkType: 'error',
        createdAt: new Date(),
        id: runId,
        runId,
        textDelta: e.message ?? 'Something went wrong'
      };
      await eventStream.push(JSON.stringify(errorChunk));

      await kv.set(messagesBySessionLogIdKey, messagesFromPreviousRuns);
      await eventStream.close();
      throw createError({
        status: 500,
        statusMessage: 'Something went wrong'
      });
    }
  })().then(async () => console.log('stream done'));

  eventStream.onClosed(async () => {
    console.log(await kv.get(currentStepBySessionLogIdKey));
    console.log('stream closed aborting all llm calls');
    abortController.abort();
    console.log(`storing message run in db ${runId}`);
    await storeMessageRunUsecase({
      runCreatedAt,
      llmInteractionsToStore,
      sessionLogId,
      userId,
      runId,
      initialMessage,
      endReason
    });
    console.log(`finished storing message run in db ${runId}`);
  });

  console.log('sending stream');
  return eventStream.send();
}
