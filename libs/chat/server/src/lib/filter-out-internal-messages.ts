import { BaseMessage } from '~myjournai/chat-shared';

export const filterOutInternalMessages = (messages: BaseMessage[]) => messages.filter(m => m.scope !== 'internal');
