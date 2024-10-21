import {
  BaseMessage,
  BaseMessageChunk,
  BaseMessageScope,
  BaseMessageType,
  CurrentStepInfo
} from '~myjournai/chat-shared';
import { kv } from '@vercel/kv';
import { formatMessages } from '../format-messages';
import { generateText } from 'ai';
import { OpenAIProvider } from '@ai-sdk/openai';
import { StoreLLMInteractionArgs } from '../store-llm-interaction';

export type PromptProps<AdditionalProps = {}> =
  {
    messages: string,
    userInfoBlock: string,
    userProfileBlock: string;
    embeddedQuestionsBlock: string;
    stepRepetitions: number
  }
  & AdditionalProps;
export type ToolProps = {
  additionalChunks: BaseMessageChunk[];
  llmInteractionId: string,
  runId: string,
  scope: BaseMessageScope;
  type: BaseMessageType;
  createdAt: Date
};

export const executeStepNodeFactory = <Tools, AdditionalProps = {}>({
                                                                      userId,
                                                                      runId,
                                                                      currentStepBySessionLogIdKey,
                                                                      messagesBySessionLogIdKey,
                                                                      executeStepPromptsAndTools,
                                                                      openai,
                                                                      model,
                                                                      abortController,
                                                                      maxSteps,
                                                                      llmInteractionsToStore,
                                                                      userInfoBlock,
                                                                      userProfileBlock,
                                                                      embeddedQuestionsBlock,
                                                                      additionalChunks,
                                                                      additionalProps
                                                                    }: {
  runId: string;
  userId: string;
  model?: string;
  currentStepBySessionLogIdKey: string
  messagesBySessionLogIdKey: string;
  executeStepPromptsAndTools: Record<number, {
    tools: (props: ToolProps) => Tools;
    prompt: (props: PromptProps<AdditionalProps>) => string
  }>
  openai: OpenAIProvider;
  abortController: AbortController;
  maxSteps: number;
  llmInteractionsToStore: StoreLLMInteractionArgs<any>[];
  userInfoBlock: string;
  userProfileBlock: string;
  embeddedQuestionsBlock: string;
  additionalChunks: BaseMessageChunk[];
  additionalProps?: AdditionalProps
}) => async (messages: BaseMessage[]): Promise<BaseMessage[]> => {
  const llmInteractionId = crypto.randomUUID();
  const type = 'execute-step';
  const scope = 'internal';
  model ??= 'llama-3.1-70b-versatile';
  const createdAt = new Date();

  let currentStep = (await kv.get(currentStepBySessionLogIdKey) ?? {
    currentStep: 1,
    stepRepetitions: 0
  }) as CurrentStepInfo;

  console.log(`executing current step ${JSON.stringify(currentStep)}`);
  if (currentStep.currentStep > maxSteps) {
    console.warn(`current step greater than available, resetting to max step ${maxSteps}`);
    currentStep = { currentStep: maxSteps, stepRepetitions: currentStep.stepRepetitions + 1 };
  }

  const messageString = formatMessages(messages);
  const currentPromptAndTools = executeStepPromptsAndTools[currentStep.currentStep];
  const currentPromptFactory = currentPromptAndTools.prompt ?? (() => '');
  const currentToolFactory = currentPromptAndTools.tools ?? (() => '');

  const prompt = currentPromptFactory({
    messages: messageString,
    userInfoBlock,
    userProfileBlock,
    embeddedQuestionsBlock,
    stepRepetitions: currentStep.stepRepetitions,
    ...additionalProps
  } as any);
  const tools = currentToolFactory({
    additionalChunks,
    llmInteractionId,
    runId,
    scope: 'external',
    type: 'tool-call',
    createdAt
  } as any);

  console.log(`prompt used for execution: ${prompt}
 current step: ${JSON.stringify(currentStep)}
  `)

  const result = await generateText({
    model: openai(model),
    prompt,
    tools: tools as any,
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

  await kv.set(currentStepBySessionLogIdKey, currentStep);
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
