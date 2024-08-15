import { EventStream } from 'h3';

export const pushChunksToStream = async (id: string, eventStream: EventStream, aiStream: AsyncIterable<any>, abortController: AbortController, author = 'ai'): Promise<string> => {
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
      await eventStream.push(JSON.stringify({ ...chunk, id, author }));
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
