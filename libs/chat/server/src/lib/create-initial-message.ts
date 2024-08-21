import { BaseMessage, BaseMessageScope, BaseMessageType } from '~myjournai/chat-shared';

export const createInitialMessage = (type: BaseMessageType, scope: BaseMessageScope, content: string): BaseMessage => type === 'ai-message' ?
  { id: crypto.randomUUID(), content, type, scope, createdAt: new Date(), formatVersion: 1 } :
  {
    id: crypto.randomUUID(),
    content,
    type,
    scope,
    createdAt: new Date(),
    formatVersion: 1
  };
