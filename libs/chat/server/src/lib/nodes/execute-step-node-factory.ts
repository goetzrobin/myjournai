import { BaseMessage, BaseMessageChunk, BaseMessageScope, BaseMessageType } from '~myjournai/chat-shared';
import { kv } from '@vercel/kv';
import { formatMessages } from '../format-messages';
import { generateText } from 'ai';
import { OpenAIProvider } from '@ai-sdk/openai';
import { StoreLLMInteractionArgs } from '../store-llm-interaction';
import { CurrentStepInfo } from './step-analyzer-node-factory';

export type PromptProps = { messages: string, userInfo: string, userProfile: string; roundtrips: number };
export type ToolProps = {
  additionalChunks: BaseMessageChunk[];
  llmInteractionId: string,
  runId: string,
  scope: BaseMessageScope;
  type: BaseMessageType;
  createdAt: Date
};

export const executeStepNodeFactory = <Tools>({
                                                           userId,
                                                           runId,
                                                           currentStepBySessionLogIdKey,
                                                           messagesBySessionLogIdKey,
                                                           executeStepPromptsAndTools,
                                                           groq,
                                                           model,
                                                           abortController,
                                                           maxSteps,
                                                           llmInteractionsToStore,
                                                           userInfo,
                                                           userProfile,
                                                           additionalChunks
                                                         }: {
  runId: string;
  userId: string;
  model?: string;
  currentStepBySessionLogIdKey: string
  messagesBySessionLogIdKey: string;
  executeStepPromptsAndTools: Record<number, {
    tools: (props: ToolProps) => Tools;
    prompt: (props: PromptProps) => string
  }>
  groq: OpenAIProvider;
  abortController: AbortController;
  maxSteps: number;
  llmInteractionsToStore: StoreLLMInteractionArgs<any>[];
  userInfo: string;
  userProfile: string;
  additionalChunks: BaseMessageChunk[];
}) => async (messages: BaseMessage[]): Promise<BaseMessage[]> => {
  const llmInteractionId = crypto.randomUUID();
  const type = 'execute-step';
  const scope = 'internal';
  model ??= 'llama-3.1-70b-versatile';
  const createdAt = new Date();

  let currentStep = (await kv.get(currentStepBySessionLogIdKey) ?? {
    currentStep: 1,
    roundtrips: 0
  }) as CurrentStepInfo;

  console.log(`executing current step ${currentStep}`);
  if (currentStep.currentStep > maxSteps) {
    console.warn(`current step greater than available, resetting to max step ${maxSteps}`);
    currentStep = { currentStep: maxSteps, roundtrips: currentStep.roundtrips + 1 };
  }

  const messageString = formatMessages(messages);
  const currentPromptAndTools = executeStepPromptsAndTools[currentStep.currentStep];
  const currentPromptFactory = currentPromptAndTools.prompt ?? (() => '');
  const currentToolFactory = currentPromptAndTools.tools ?? (() => '');
  const prompt = currentPromptFactory({
    messages: messageString,
    userInfo,
    userProfile,
    roundtrips: currentStep.roundtrips
  } as any);
  const tools = currentToolFactory({
    additionalChunks,
    llmInteractionId,
    runId,
    scope: 'external',
    type: 'tool-call',
    createdAt
  } as any);

  const result = await generateText({
    model: groq(model),
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
