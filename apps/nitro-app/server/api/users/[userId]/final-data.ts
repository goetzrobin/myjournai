import { db } from '~db/client';
import { sessionLogs } from '~db/schema/session-logs';
import { and, eq, sql } from 'drizzle-orm';
import { messageRuns } from '~db/schema/message-runs';
import { llmInteractions } from '~db/schema/llm-interactions';

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId');
  const [potentialCount] = await db.select({
    count: sql<number>`cast(count(${sessionLogs.sessionId}) as int)`
  }).from(sessionLogs).where(and(
    eq(sessionLogs.userId, userId),
    eq(sessionLogs.status, 'COMPLETED')
  ));

  const [potentialCharsSent] = await db.select({
    count: sql<number>`cast(sum(length(${messageRuns.userMessage})) as int)`
  }).from(messageRuns).where(and(
    eq(messageRuns.userId, userId)
  ));

  const [potentialCharsReceived] = await db.select({
    count: sql<number>`cast(sum(length(${llmInteractions.generatedText})) as int)`
  }).from(llmInteractions).where(and(
    eq(llmInteractions.userId, userId),
    eq(llmInteractions.type, 'ai-message')
  ));

  const [potentialLogInfo] = await db.select({
    avgPreFeeling: sql<number>`cast(avg(coalesce(${sessionLogs.preFeelingScore},0)) as int)`,
    avgPreAnxiety: sql<number>`cast(avg(coalesce(${sessionLogs.preAnxietyScore},0)) as int)`,
    avgPreMotivation: sql<number>`cast(avg(coalesce(${sessionLogs.preMotivationScore},0)) as int)`,
    avgPostFeeling: sql<number>`cast(avg(coalesce(${sessionLogs.postFeelingScore},0)) as int)`,
    avgPostAnxiety: sql<number>`cast(avg(coalesce(${sessionLogs.postAnxietyScore},0)) as int)`,
    avgPostMotivation: sql<number>`cast(avg(coalesce(${sessionLogs.postMotivationScore},0)) as int)`
  }).from(sessionLogs).where(and(
    eq(sessionLogs.userId, userId),
    eq(sessionLogs.status, 'COMPLETED')
  )).groupBy(sessionLogs.userId);

  return {
    sessionsCompleted: potentialCount?.count ?? 0,
    wordsWritten: Math.round((potentialCharsSent?.count ?? 0) / 4.7),
    wordsRead: Math.round((potentialCharsReceived?.count ?? 0) / 4.7),
    avgPreFeeling: potentialLogInfo?.avgPreFeeling ?? 0,
    avgPreAnxiety: potentialLogInfo?.avgPreAnxiety ?? 0,
    avgPreMotivation: potentialLogInfo?.avgPreMotivation ?? 0,
    avgPostFeeling: potentialLogInfo?.avgPostFeeling ?? 0,
    avgPostAnxiety: potentialLogInfo?.avgPostAnxiety ?? 0,
    avgPostMotivation: potentialLogInfo?.avgPostMotivation ?? 0,
  };
});
