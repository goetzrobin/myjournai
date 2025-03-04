import { BaseMessageChunk, BaseMessageScope, BaseMessageType } from '~myjournai/chat-shared';

export type PromptProps<AdditionalProps = {}> =
  {
    messages: string,
    userInfoBlock: string,
    userProfileBlock: string;
    contextBlock: string;
    embeddedQuestionsBlock: string;
    stepRepetitions: number
  }
  & AdditionalProps;
export type ToolProps = {
  additionalChunks: BaseMessageChunk[];
  llmInteractionId: string,
  runId: string,
  scope: BaseMessageScope;
  type: BaseMessageType;
  createdAt: Date
};
