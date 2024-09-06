import { createError } from 'h3';
import { db } from '~db/client';
import { users } from '~db/schema/users';
import { and, desc, eq } from 'drizzle-orm';
import { sessions } from '~db/schema/sessions';
import { sessionLogs } from '~db/schema/session-logs';
import { onboardingLetters } from '~db/schema/onboarding-letters';

export default defineEventHandler(async (event) => {
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
  // create session log for that session with id
  const [existingSessionLog] = await db.select().from(sessionLogs).where(
    and(
      eq(sessionLogs.sessionId, session.id),
      eq(sessionLogs.userId, userId)
    )
  ).orderBy(desc(sessionLogs.version));

  await db.insert(sessionLogs).values({
    userId: userId,
    sessionId: session.id,
    startedAt: new Date(),
    version: existingSessionLog?.version !== undefined ? existingSessionLog.version + 1 : 0
  });

  await db.update(sessionLogs).set({
    status: 'COMPLETED',
    updatedAt: new Date()
  }).where(eq(sessionLogs.id, existingSessionLog.id));

  // mark onboarding as not complete
  await db.update(users).set({
    onboardingCompletedAt: null,
    name: null,
    pronouns: null,
    genderIdentity: null,
    ethnicity: null,
    ncaaDivision: null,
    graduationYear: null,
    birthday: null,
    updatedAt: new Date()
  }).where(eq(users.id, userId));

  // delete onboarding letter
  await db.delete(onboardingLetters).where(eq(onboardingLetters.userId, userId));

  // return updated user
  return await db.select().from(users).where(eq(users.id, userId))?.[0];
});
