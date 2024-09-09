import { createError } from 'h3';
import { createUserProfileUsecase, queryLatestUserProfileBy } from '@myjournai/user-server';
import { useRuntimeConfig } from 'nitropack/runtime';
import { db } from '~db/client';
import { users } from '~db/schema/users';
import { and, desc, eq } from 'drizzle-orm';
import { sessions } from '~db/schema/sessions';
import { sessionLogs } from '~db/schema/session-logs';

export default defineEventHandler(async (event) => {
  const { openApiKey } = useRuntimeConfig(event);
  const userId = getRouterParam(event, 'userId');
  if (userId !== event.context.user?.id) {
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      message: 'Can only create profile for yourself'
    });
  }

  // find session by [slug] onboarding-v0
  const [session] = await db.select().from(sessions).where(eq(sessions.slug, 'onboarding-v0'));
  if (!session) {
    throw createError({
      status: 500,
      statusMessage: 'Session blueprint does not exist.',
      message: 'Please reach out to our support team.'
    });
  }

  // mark onboarding as complete
  await db.update(users).set({ onboardingCompletedAt: new Date(), updatedAt: new Date() }).where(eq(users.id, userId));
console.log('marked users onboarding as completed')

  // create session log for that session with id
  const [existingSessionLog] = await db.select().from(sessionLogs).where(
    and(
      eq(sessionLogs.sessionId, session.id),
      eq(sessionLogs.userId, userId)
    )
  ).orderBy(desc(sessionLogs.version));

  if (!existingSessionLog || existingSessionLog.status !== 'IN_PROGRESS') {
    await db.insert(sessionLogs).values({
      userId: userId,
      sessionId: session.id,
      startedAt: new Date(),
      version: existingSessionLog?.version !== undefined ? existingSessionLog.version + 1 : 0
    });
  }

  // create user profile
  const existingProfile = await queryLatestUserProfileBy({ userId });
  if (!existingProfile) {
    const [newProfile] = await createUserProfileUsecase({
      userId,
      apiKey: openApiKey
    });
    return newProfile;
  }
  return existingProfile;
});
