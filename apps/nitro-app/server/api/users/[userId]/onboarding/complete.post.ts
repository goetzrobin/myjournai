import { createError } from 'h3';
import { createUserProfileUsecase, queryLatestUserProfileBy } from '~myjournai/user-server';
import { useRuntimeConfig } from 'nitropack/runtime';
import { db } from '~db/client';
import { users } from '~db/schema/users';
import { and, desc, eq } from 'drizzle-orm';
import { sessions } from '~db/schema/sessions';
import { sessionLogs } from '~db/schema/session-logs';
import { createClient } from '~myjournai/auth-server';

export default defineEventHandler(async (event) => {
  const { openApiKey } = useRuntimeConfig(event);
  const userId = getRouterParam(event, 'userId');

  console.info(`[Onboarding] Start onboarding for user ${userId}`);

  if (userId !== event.context.user?.id) {
    console.warn(`[Onboarding] User ${event.context.user?.id} tried to onboard as ${userId}`);
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      message: 'Can only create profile for yourself'
    });
  }

  // find session by [slug] onboarding-v0
  const [session] = await db.select().from(sessions).where(eq(sessions.slug, 'onboarding-v0'));
  if (!session) {
    console.error('[Onboarding] Missing session blueprint: onboarding-v0');
    throw createError({
      status: 500,
      statusMessage: 'Session blueprint does not exist.',
      message: 'Please reach out to our support team.'
    });
  }
  console.info(`[Onboarding] Found session blueprint ${session.id}`);

  // mark onboarding as complete
  await db.update(users)
    .set({ onboardingCompletedAt: new Date(), updatedAt: new Date() })
    .where(eq(users.id, userId));

  console.info(`[Onboarding] Marked onboarding as completed for user ${userId}`);

  const supabase = await createClient(event);
  await supabase.auth.updateUser({ data: { 'onboarding_completed': true } });

  console.info(`[Onboarding] Synced onboarding completion with Supabase for user ${userId}`);

  let sessionLogId: string
  // create session log for that session with id
  const [existingSessionLog] = await db.select().from(sessionLogs).where(
    and(eq(sessionLogs.sessionId, session.id), eq(sessionLogs.userId, userId))
  ).orderBy(desc(sessionLogs.version));
  sessionLogId = existingSessionLog?.id

  if (!existingSessionLog || existingSessionLog.status !== 'IN_PROGRESS') {
   const [newLog] = await db.insert(sessionLogs).values({
      userId: userId,
      sessionId: session.id,
      startedAt: new Date(),
      version: existingSessionLog?.version !== undefined ? existingSessionLog.version + 1 : 0
    }).returning();
   sessionLogId = newLog.id

    console.info(`[Onboarding] Created session log ${sessionLogId} for user ${userId}, session ${session.id}`);
  } else {
    console.info(`[Onboarding] Session log ${sessionLogId} already exists for user ${userId}, session ${session.id}`);
  }

  // create user profile
  const existingProfile = await queryLatestUserProfileBy({ userId });
  if (!existingProfile) {
    console.info(`[Onboarding] No existing profile found for user ${userId}, creating new profile.`);

    try {
      const [newProfile] = await createUserProfileUsecase({
        userId,
        apiKey: openApiKey
      });

      console.info(`[Onboarding] Created new profile for user ${userId}. Returning.`);
      return {...newProfile, sessionLogId};
    } catch (error) {
      console.error(`[Onboarding] Failed to create profile for user ${userId}:`, error);
      throw createError({
        status: 500,
        statusMessage: 'Failed to create user profile',
        message: error.message || 'An unknown error occurred'
      });
    }
  }

  console.info(`[Onboarding] Returning existing profile for user ${userId}. Returning.`);
  return {...existingProfile, sessionLogId};
});
