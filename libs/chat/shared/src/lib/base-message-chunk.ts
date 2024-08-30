import { BaseMessageScope, BaseMessageType } from './base-message';

export type BaseMessageChunk = {
  id: string;
  runId: string;
  type?: BaseMessageType;
  scope?: BaseMessageScope;
  chunkType: string;
  textDelta: string;
  createdAt: Date;
  toolCallId?: string;
  toolName?: string;
  args?: any;
  result?: any;
}
