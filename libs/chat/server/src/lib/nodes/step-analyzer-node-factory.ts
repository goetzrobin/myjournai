import { BaseMessage, CurrentStepInfo } from '~myjournai/chat-shared';
import { kv } from '@vercel/kv';
import { generateText } from 'ai';
import { formatMessages } from '../format-messages';
import { filterOutInternalMessages } from '../filter-out-internal-messages';
import { StoreLLMInteractionArgs } from '../store-llm-interaction';
import { AnthropicProvider } from '@ai-sdk/anthropic';


export const stepAnalyzerNodeFactory = ({
                                          userId,
                                          runId,
                                          currentStepBySessionLogIdKey,
                                          messagesBySessionLogIdKey,
                                          stepAnalyzerPrompt,
                                          anthropic,
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
  anthropic: AnthropicProvider;
  abortController: AbortController;
  maxSteps: number;
  llmInteractionsToStore: StoreLLMInteractionArgs<any>[];
  onConversationEnd?: () => void
}) => async (messages: BaseMessage[]): Promise<BaseMessage[]> => {
  const llmInteractionId = crypto.randomUUID();
  const type = 'analyzer';
  const scope = 'internal';
  model = model ??= 'claude-3-5-sonnet-latest';
  const createdAt = new Date();

  let currentStepInfo = (await kv.get(currentStepBySessionLogIdKey) ?? {currentStep: 1, stepRepetitions: 0}) as CurrentStepInfo;

  const messageString = formatMessages(filterOutInternalMessages((messages)));
  const prompt = stepAnalyzerPrompt(messageString, currentStepInfo);

  console.log(`prompt used for step analysis: ${prompt}`)

  const result = await generateText({
    model: anthropic(model),
    prompt,
    abortSignal: abortController.signal
  });

  console.log(`STEP ANALYSIS RESULT: ${result.text}`)

  if (result.text.trim().includes('ADVANCE')) {
    const initialRepetitions = currentStepInfo.stepRepetitions;
    currentStepInfo = {currentStep: currentStepInfo.currentStep + 1, stepRepetitions: 0};
    if (currentStepInfo.currentStep > maxSteps) {
      console.log('end conversation here, incrementing repetitions for final step');
      currentStepInfo = {currentStep: currentStepInfo.currentStep, stepRepetitions: initialRepetitions + 1};
      onConversationEnd?.();
    }
    console.log('decided to advance to next step. incrementing current step to', JSON.stringify(currentStepInfo));
  } else {
    currentStepInfo = {currentStep: currentStepInfo.currentStep, stepRepetitions: (currentStepInfo.stepRepetitions ?? 0) + 1};
    console.log(`decided to stay: remaining on step ${JSON.stringify(currentStepInfo)}`);
  }

  messages.push({ id: llmInteractionId, type, scope, content: result.text, formatVersion: 1, createdAt });

  console.log(`continuing with the following step info: ${JSON.stringify(currentStepInfo)} for ${currentStepBySessionLogIdKey}`);

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
