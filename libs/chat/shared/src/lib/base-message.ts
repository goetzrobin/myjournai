export const BaseMessageTypes = ['ai-message', 'tool-call', 'user-message', 'analyzer', 'execute-step', 'error'] as const;
export type BaseMessageType = typeof BaseMessageTypes[number];

export const BaseMessageScopes = ['internal', 'external'] as const;
export type BaseMessageScope = typeof BaseMessageScopes[number];

export const BaseMessageFormatVersions = [1] as const;
export type BaseMessageFormatVersion = typeof BaseMessageFormatVersions[number];

export interface BaseMessage {
  id: string;
  content: string;
  type: BaseMessageType;
  scope: BaseMessageScope;
  createdAt: Date;
  formatVersion: BaseMessageFormatVersion;
  currentStep?: number;
  stepRepetitions?: number;
}
