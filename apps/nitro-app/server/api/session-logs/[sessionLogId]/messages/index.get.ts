import { db } from '~db/client';
import { messageRuns } from '~db/schema/message-runs';
import { and, eq, sql } from 'drizzle-orm';
import { llmInteractions } from '~db/schema/llm-interactions';
import { unionAll } from 'drizzle-orm/pg-core';

export default eventHandler(async (event) => {
  const sessionLogId = getRouterParam(event, 'sessionLogId');

  const messageRunsQuery = db.select({
    id: messageRuns.id,
    userId: messageRuns.userId,
    type: messageRuns.userMessageType,
    scope: sql<string>`coalesce(cast("message_runs"."user_message_scope" as varchar), 'external')`.as('scope'),
    content: messageRuns.userMessage,
    createdAt: messageRuns.createdAt
  }).from(messageRuns).where(eq(messageRuns.sessionLogId, sessionLogId));

  const llmInteractionsQuery = db.select({
    id: llmInteractions.id,
    userId: llmInteractions.userId,
    type: llmInteractions.type,
    scope: sql<string>`coalesce(cast("llm_interactions"."scope" as varchar), 'external')`.as('scope'),
    content: llmInteractions.generatedText,
    createdAt: llmInteractions.createdAt
  }).from(llmInteractions)
    .innerJoin(messageRuns, and(eq(messageRuns.id, llmInteractions.messageRunId), eq(messageRuns.sessionLogId, sessionLogId)));

  const unionQuery = unionAll(messageRunsQuery, llmInteractionsQuery).as('results');

  const results = await db.select().from(unionQuery)
    .orderBy(unionQuery.createdAt)
    .where(and(
      eq(unionQuery.scope, 'external')
    ));

  if (results.length > 0 && results[0].userId !== event.context.user?.id) {
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      message: 'Can only request messages for yourself'
    });
  }
  return results;
});
