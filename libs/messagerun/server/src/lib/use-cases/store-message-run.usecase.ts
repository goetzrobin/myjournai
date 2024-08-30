import { BaseMessage } from '~myjournai/chat-shared';
import { storeLlmInteraction, StoreLLMInteractionArgs } from '~myjournai/chat-server';
import { db } from '~db/client';
import { messageRuns } from '~db/schema/message-runs';

export type StoreMessageRunCommand = {
  initialMessage: BaseMessage;
  runCreatedAt: Date;
  runId: string;
  userId: string,
  sessionLogId: string;
  llmInteractionsToStore: StoreLLMInteractionArgs<any>[]
}
export const storeMessageRunUsecase = async ({
                                        runId,
                                        userId,
                                        sessionLogId,
                                        llmInteractionsToStore,
                                        runCreatedAt,
                                        initialMessage
                                      }: StoreMessageRunCommand) => {
  await db.insert(messageRuns).values({
    id: runId,
    userId,
    sessionLogId,
    userMessage: initialMessage.content,
    userMessageType: initialMessage.type,
    userMessageScope: initialMessage.scope,
    createdAt: runCreatedAt,
    finishedAt: new Date()
  });
  console.log(`run stored storing ${llmInteractionsToStore.length} interactions in db ${runId}`);
  for (const interaction of llmInteractionsToStore) {
    await storeLlmInteraction(interaction);
  }
};
