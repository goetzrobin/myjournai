import { db } from '~db/client';
import { SessionLog, sessionLogs, SessionLogWithSession } from '~db/schema/session-logs';
import { sessions } from '~db/schema/sessions';
import { and, desc, eq, or, sql } from 'drizzle-orm';
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
export const queryMostRecentSessionLogBy = async ({ sessionSlug, sessionId, userId, includeAborted }: {
  sessionSlug?: string;
  sessionId?: string;
  userId: string;
  includeAborted?: boolean
}): Promise<SessionLogWithSession | undefined> => {
   const query = db.select()
    .from(sessionLogs)
    .innerJoin(sessions, eq(sessions.id, sessionLogs.sessionId))
    .where(
      and(
        eq(sessionLogs.userId, userId),
        !sessionId ? undefined : eq(sessions.id, sessionId),
        !sessionSlug ? undefined : eq(sessions.slug, sessionSlug),
        or(
          eq(sessionLogs.status, 'IN_PROGRESS'),
          eq(sessionLogs.status, 'COMPLETED'),
          !includeAborted ? undefined : eq(sessionLogs.status, 'ABORTED')
        )
      )
    ).orderBy(desc(sessionLogs.version))
    .limit(1);
  const [potentialSessionLog] = await query;
  console.log('found', potentialSessionLog, query.toSQL());
  return !potentialSessionLog ? undefined : {
    ...potentialSessionLog.session_logs,
    session: potentialSessionLog?.sessions
  };
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
