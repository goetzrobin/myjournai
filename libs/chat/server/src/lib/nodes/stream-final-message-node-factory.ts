import { BaseMessage, BaseMessageChunk } from '~myjournai/chat-shared';
import { formatMessages } from '../format-messages';
import { filterOutInternalMessages } from '../filter-out-internal-messages';
import { createFinalMessageAugmentationPrompt } from '../prompts/create-final-message-augmentation-prompt';
import { streamText } from 'ai';
import { pushChunksToStream } from '~myjournai/utils-server';
import { kv } from '@vercel/kv';
import { StoreLLMInteractionArgs } from '../store-llm-interaction';
import { AnthropicProvider } from '@ai-sdk/anthropic';
import { EventStream } from 'h3';

export const streamFinalMessageNodeFactory = ({
                                                userId,
                                                runId,
                                                messagesBySessionLogIdKey,
                                                anthropic,
                                                model,
                                                abortController,
                                                llmInteractionsToStore,
                                                userInfo,
                                                userProfile,
                                                additionalChunks,
                                                eventStream,
                                                additionalPrompt
                                              }: {
  runId: string;
  userId: string;
  model?: string;
  messagesBySessionLogIdKey: string;
  anthropic: AnthropicProvider;
  abortController: AbortController;
  maxSteps: number;
  llmInteractionsToStore: StoreLLMInteractionArgs<any>[];
  userInfo: string;
  userProfile: string;
  additionalChunks: BaseMessageChunk[];
  eventStream: EventStream;
  additionalPrompt?: string
}) => async (messages: BaseMessage[]) => {
  const llmInteractionId = crypto.randomUUID();
  model ??= 'claude-3-5-sonnet-20240620';
  const type = 'ai-message';
  const scope = 'external';
  const createdAt = new Date();

  const messageString = formatMessages(filterOutInternalMessages(messages.slice(messages.length - 5, messages.length)));
  const lastMessage = messages[messages.length - 1].content as string;
  const prompt = createFinalMessageAugmentationPrompt(messageString, lastMessage, userInfo, userProfile, additionalPrompt);

  const finalStream = await streamText({
    model: anthropic(model),
    prompt,
    abortSignal: abortController.signal,
    onFinish: result => {
      console.log('finished stream from anthropic to fe');
      llmInteractionsToStore.push({
        ...result,
        runId,
        userId,
        llmInteractionId,
        model: model as string,
        type,
        scope,
        createdAt,
        prompt
      });
    }
  });
  const generatedMessage = await pushChunksToStream({
    id: llmInteractionId,
    runId,
    createdAt,
    eventStream,
    aiStream: finalStream.fullStream,
    abortController,
    additionalChunks
  });

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
