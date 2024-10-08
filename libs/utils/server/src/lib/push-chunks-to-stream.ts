import { EventStream } from 'h3';
import { BaseMessageChunk, BaseMessageScope, BaseMessageType, CurrentStepInfo } from '~myjournai/chat-shared';

export const pushChunksToStream = async ({
                                           eventStream,
                                           aiStream,
                                           additionalChunks,
                                           id,
                                           runId,
                                           scope,
                                           type,
                                           createdAt,
                                           abortController,
                                           currentStepInfo
                                         }: {
  id: string,
  runId: string,
  createdAt: Date,
  eventStream: EventStream,
  aiStream: AsyncIterable<any>,
  abortController: AbortController,
  type?: BaseMessageType,
  scope?: BaseMessageScope,
  additionalChunks?: BaseMessageChunk[],
  currentStepInfo?: CurrentStepInfo
}): Promise<string> => {
  type ??= 'ai-message';
  scope ??= 'external';
  await eventStream.push('[START]');
  let content = '';
  try {
    for await (const chunk of aiStream) {
      if (abortController.signal.aborted) {
        console.log('ending stream');
        break;
      }
      if (chunk.textDelta && chunk.textDelta.length > 0) {
        content += chunk.textDelta;
      }
      await eventStream.push(JSON.stringify({
        ...chunk,
        chunkType: chunk.type,
        id,
        runId,
        scope,
        type,
        createdAt, ...currentStepInfo
      }));
    }
  } catch (err: any) {
    console.error(err);
    await eventStream.push(JSON.stringify({
      message: err.message,
      chunkType: 'error',
      id,
      runId,
      scope,
      type,
      createdAt, ...currentStepInfo
    }));
  } finally {
    for (const chunk of additionalChunks ?? []) {
      await eventStream.push(JSON.stringify(chunk));
    }
    console.log('finally done');
    await eventStream.push('[DONE]');
    await eventStream.close();
  }
  return content;
};
