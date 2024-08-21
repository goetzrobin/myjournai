import { EventStream } from 'h3';
import { BaseMessageScope, BaseMessageType } from '~myjournai/chat-shared';

export const pushChunksToStream = async (id: string, runId: string, createdAt: Date, eventStream: EventStream, aiStream: AsyncIterable<any>, abortController: AbortController, type: BaseMessageType = 'ai-message', scope: BaseMessageScope = 'external'): Promise<string> => {
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
      await eventStream.push(JSON.stringify({ ...chunk, chunkType: chunk.type, id, runId, scope, type, createdAt }));
    }
  } catch (err) {
    console.error(err);
    // Ignore error
  } finally {
    console.log('finally done');
    await eventStream.push('[DONE]');
    await eventStream.close();
  }
  return content;
};
