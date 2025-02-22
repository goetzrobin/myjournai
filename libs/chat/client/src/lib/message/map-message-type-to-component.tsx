import { BaseMessage, BaseMessageChunk, BaseMessageType } from '~myjournai/chat-shared';
import { AIMessage } from './ai-message';
import { UserMessage } from './user-message';
import { MessageError } from './message-error';
import { StreamRequest } from '../use-stream-response';

export const mapMessageTypeToComponent = (type: BaseMessageType | undefined, key: string, content: string, isLastChunk = false,
                                          lastChunkError = false, onLastChunkRetry = () => console.log('on last chunk retry')) => {
  if (type === 'ai-message') return <AIMessage maKey={key} key={key} content={content} />;
  if (type === 'user-message') return <UserMessage maKey={key} key={key} content={content}
                                                   retryAble={isLastChunk && lastChunkError}
                                                   onRetry={onLastChunkRetry} />;
  return null;
};

export const mapChunksToChatComponents = (messageChunksByTimestamp: Record<string, BaseMessageChunk[]>,
                                          startStream: (request: StreamRequest) => void,
                                          removeChunksForTimestamp: (isoTimeStamp: string) => void,
                                          lastChunkError = false,
                                          onLastChunkRetry: () => void = () => console.log('on last chunk retry')
) => {
  const sortedMessages = Object.entries(messageChunksByTimestamp)
    // keys are iso dates
    .sort(([key1], [key2]) => key1.localeCompare(key2));
  return sortedMessages.map(([key, chunks], index) => {
    const isLastChunk = index === sortedMessages.length - 1;
    return chunks[0].chunkType === 'error' ?
      <MessageError removeChunksForTimestamp={removeChunksForTimestamp} error={chunks[0]?.textDelta}
                    startStream={startStream} previousKeyAndChunks={sortedMessages[index - 1]}
                    key={key} /> : chunks[0].scope === 'internal' ? null
        : mapMessageTypeToComponent(chunks[0]?.type, key + chunks.length, chunks.map((chunk) => chunk.textDelta).join(''), isLastChunk, lastChunkError, onLastChunkRetry)
  });
};

export const mapNonStreamedDBMessagesToChatComponents = (messageChunksByTimestamp: Record<string, BaseMessageChunk[]>, dbMessages: BaseMessage[]) =>
  dbMessages.filter(m => !messageChunksByTimestamp[m.createdAt as any])
    .map(chunks => chunks.scope === 'internal' ? null :
      mapMessageTypeToComponent(chunks?.type, chunks.id + chunks.content.length + '-' + chunks.createdAt, chunks.content));
