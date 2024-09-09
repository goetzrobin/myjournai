import { db } from '~db/client';
import { SessionLog, sessionLogs, SessionLogWithSession } from '~db/schema/session-logs';
import { sessions } from '~db/schema/sessions';
import { and, desc, eq, sql } from 'drizzle-orm';
import { BaseMessage } from '~myjournai/chat-shared';
import { messageRuns } from '~db/schema/message-runs';
import { llmInteractions } from '~db/schema/llm-interactions';
import { unionAll } from 'drizzle-orm/pg-core';

export const querySessionLogBy = async ({ id }: {
  id: string;
}): Promise<SessionLog | undefined> => {
  const [potentialSessionLog] = await db.select()
    .from(sessionLogs)
    .where(
      and(
        !id ? undefined : eq(sessionLogs.id, id)
      )
    ).orderBy(desc(sessionLogs.version))
    .limit(1);
  return potentialSessionLog;
};
export const queryMostRecentSessionLogBy = async ({ sessionSlug, sessionId, userId }: {
  sessionSlug?: string;
  sessionId?: string;
  userId: string
}): Promise<SessionLogWithSession | undefined> => {
  const [potentialSessionLog] = await db.select()
    .from(sessionLogs)
    .innerJoin(sessions, eq(sessions.id, sessionLogs.sessionId))
    .where(
      and(
        !sessionId ? undefined : eq(sessions.id, sessionId),
        !sessionSlug ? undefined : eq(sessions.slug, sessionSlug),
        eq(sessionLogs.userId, userId)
      )
    ).orderBy(desc(sessionLogs.version))
    .limit(1);
  console.log('found', potentialSessionLog);
  return !potentialSessionLog ? undefined : {...potentialSessionLog.session_logs, session: potentialSessionLog?.sessions};
};

export const querySessionLogMessagesBy = async ({ sessionLogId }: { sessionLogId: string }): Promise<(BaseMessage & {
  userId: string
})[]> => {
  const messageRunsQuery = db.select({
    id: messageRuns.id,
    userId: messageRuns.userId,
    type: messageRuns.userMessageType,
    scope: sql<string>`coalesce(cast("message_runs"."user_message_scope" as varchar), 'external')`.as('scope'),
    content: messageRuns.userMessage,
    createdAt: messageRuns.createdAt,
    formatVersion: sql<number>`1`.as('formatVersion')
  }).from(messageRuns).where(eq(messageRuns.sessionLogId, sessionLogId));

  const llmInteractionsQuery = db.select({
    id: llmInteractions.id,
    userId: llmInteractions.userId,
    type: llmInteractions.type,
    scope: sql<string>`coalesce(cast("llm_interactions"."scope" as varchar), 'external')`.as('scope'),
    content: llmInteractions.generatedText,
    createdAt: llmInteractions.createdAt,
    formatVersion: sql<number>`1`.as('formatVersion')
  }).from(llmInteractions)
    .innerJoin(messageRuns, and(eq(messageRuns.id, llmInteractions.messageRunId), eq(messageRuns.sessionLogId, sessionLogId)));

  const unionQuery = unionAll(messageRunsQuery, llmInteractionsQuery).as('results');

  return (await db.select().from(unionQuery)
    .orderBy(unionQuery.createdAt)
    .where(and(
      eq(unionQuery.scope, 'external')
    ))) as (BaseMessage & { userId: string })[];
};
