import { BaseMessage, BaseMessageChunk, BaseMessageType } from '~myjournai/chat-shared';
import { AIMessage } from './ai-message';
import { UserMessage } from './user-message';

export const mapMessageTypeToComponent = (type: BaseMessageType | undefined, key: string, content: string) => {
  if (type === 'ai-message') return <AIMessage key={key} content={content} />;
  if (type === 'user-message') return <UserMessage key={key} content={content} />;
  return null;
};

export const mapChunksToChatComponents = (messageChunksByTimestamp: Record<string, BaseMessageChunk[]>) => Object.entries(messageChunksByTimestamp)
  // keys are iso dates
  .sort(([key1], [key2]) => key1.localeCompare(key2))
  .map(([key, chunks]) => chunks[0].scope === 'internal' ? null :
    mapMessageTypeToComponent(chunks[0]?.type, key + chunks.length, chunks.map((chunk) => chunk.textDelta).join('')));

export const mapNonStreamedDBMessagesToChatComponents = (messageChunksByTimestamp: Record<string, BaseMessageChunk[]>, dbMessages: BaseMessage[]) => dbMessages.filter(m => !messageChunksByTimestamp[m.createdAt as any])
  .map(chunks => chunks.scope === 'internal' ? null :
    mapMessageTypeToComponent(chunks?.type, chunks.id + chunks.content.length, chunks.content));
