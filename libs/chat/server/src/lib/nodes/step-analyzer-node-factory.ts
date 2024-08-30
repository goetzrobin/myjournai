import { BaseMessage } from '~myjournai/chat-shared';
import { kv } from '@vercel/kv';
import { generateText } from 'ai';
import { formatMessages } from '../format-messages';
import { filterOutInternalMessages } from '../filter-out-internal-messages';
import { OpenAIProvider } from '@ai-sdk/openai';
import { StoreLLMInteractionArgs } from '../store-llm-interaction';

export type CurrentStepInfo = {currentStep: number; roundtrips: number}

export const stepAnalyzerNodeFactory = ({
                                          userId,
                                          runId,
                                          currentStepBySessionLogIdKey,
                                          messagesBySessionLogIdKey,
                                          stepAnalyzerPrompt,
                                          openai,
                                          model,
                                          abortController,
                                          maxSteps,
                                          llmInteractionsToStore,
                                          onConversationEnd
                                        }: {
  runId: string;
  userId: string;
  model?: string;
  currentStepBySessionLogIdKey: string
  messagesBySessionLogIdKey: string;
  stepAnalyzerPrompt: (messageString: string, currentStepInfo: CurrentStepInfo, ...args: any) => string;
  openai: OpenAIProvider;
  abortController: AbortController;
  maxSteps: number;
  llmInteractionsToStore: StoreLLMInteractionArgs<any>[];
  onConversationEnd?: () => void
}) => async (messages: BaseMessage[]): Promise<BaseMessage[]> => {
  const llmInteractionId = crypto.randomUUID();
  const type = 'analyzer';
  const scope = 'internal';
  model = model ??= 'gpt-4o';
  const createdAt = new Date();

  let currentStepInfo = (await kv.get(currentStepBySessionLogIdKey) ?? {currentStep: 1, roundtrips: 0}) as CurrentStepInfo;

  const messageString = formatMessages(filterOutInternalMessages((messages)));
  const prompt = stepAnalyzerPrompt(messageString, currentStepInfo);

  const result = await generateText({
    model: openai(model),
    prompt,
    abortSignal: abortController.signal
  });

  if (result.text.trim() === 'advance') {
    currentStepInfo = {currentStep: currentStepInfo.currentStep + 1, roundtrips: 0};
    if (currentStepInfo.currentStep === maxSteps) {
      console.log('end conversation here');
      onConversationEnd?.();
    }
    console.log('incrementing current step to', JSON.stringify(currentStepInfo));
  } else {
    currentStepInfo = {currentStep: currentStepInfo.currentStep, roundtrips: currentStepInfo.roundtrips + 1};
    console.log(`remaining on step ${JSON.stringify(currentStepInfo)}`);
  }

  messages.push({ id: llmInteractionId, type, scope, content: result.text, formatVersion: 1, createdAt });

  console.log(`determined current step ${currentStepInfo} for ${currentStepBySessionLogIdKey}`);

  await kv.set(messagesBySessionLogIdKey, messages);
  await kv.set(currentStepBySessionLogIdKey, currentStepInfo);
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
