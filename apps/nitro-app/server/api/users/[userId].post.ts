import { updateUserUsecase } from '~myjournai/user-server';
import { userUpdateRequestSchema } from '~myjournai/user-shared';
import { z } from 'zod';
import { db } from '~db/client';
import { cohorts } from '~db/schema/cohorts';
import { cohortsUsers } from '~db/schema/cohorts-users';

function validateUserUpdateRequest(
  requestData: unknown,
  userId: string,
  currentUserId: string
): z.infer<typeof userUpdateRequestSchema> & { cohort?: string } {
  console.log(`[user-update-handler] start validate for userid=${userId}`, { requestdata: JSON.stringify(requestData) });

  // Check if user can only update own data
  if (userId !== currentUserId) {
    console.log(`[user-update-handler] rejected - user ${currentUserId} try update different user ${userId}`);
    throw createError({
      status: 400,
      message: 'User can only update their own data'
    });
  }

  // Validate request body
  const parsedRequest = userUpdateRequestSchema
    .extend({cohort: z.string().optional()})
    .safeParse(requestData);

  if (!parsedRequest.success) {
    console.log(`[user-update] rejected - validation failed for userid=${userId}`, {
      error: parsedRequest.error.message
    });
    throw createError({
      status: 400,
      message: parsedRequest.error.message
    });
  }

  console.log(`[user-update] validation passed for userid=${userId}`, {
    validdata: JSON.stringify(parsedRequest.data)
  });
  return parsedRequest.data;
}

// Cohort function with types
async function updateUserCohort(userId: string, cohortSlug: string): Promise<void> {
  console.log(`[cohort-update] try update cohort for userid=${userId} to cohort=${cohortSlug}`);

  if (!cohortSlug) {
    console.log(`[cohort-update] no cohort provided for userid=${userId}, skipping`);
    return; // No cohort to update
  }

  const existingCohorts = await db.select().from(cohorts);
  console.log(`[cohort-update] found ${existingCohorts.length} possible cohorts`);

  const matchingCohort = existingCohorts.find(c => c.slug === cohortSlug);
  const otherCohort = existingCohorts.find(c => c.slug === 'other');

  // Prepare cohort user data
  const cohortUserData = {
    userId,
    status: 'ACTIVE' as const
  };

  // Add to matching cohort or 'other' cohort
  if (matchingCohort) {
    console.log(`[cohort-update] adding userid=${userId} to exact match cohort=${matchingCohort.slug}(${matchingCohort.id})`);
    await db.insert(cohortsUsers).values({
      ...cohortUserData,
      cohortId: matchingCohort.id
    });
  } else if (otherCohort) {
    console.log(`[cohort-update] adding userid=${userId} to 'other' cohort with othername=${cohortSlug}`);
    await db.insert(cohortsUsers).values({
      ...cohortUserData,
      cohortId: otherCohort.id,
      otherName: cohortSlug
    });
  } else {
    console.log(`[cohort-update] warning! no matching cohort or 'other' cohort found for userid=${userId}`);
  }
}

// Main handler types come from Nuxt/H3 so we keep as is
export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId');
  console.log(`[user-update-handler] start update for userid=${userId}`);

  try {
    const requestBody = await readBody(event);

    // Validate request
    const validData = validateUserUpdateRequest(
      requestBody,
      userId,
      event.context.user.id
    );

    // Update user
    console.log(`[user-update-handler] calling updateuserusecase for userid=${userId}`);
    const result = (await updateUserUsecase(userId, validData))[0];
    console.log(`[user-update-handler] user update complete for userid=${userId}`);

    // Update cohort if needed
    if (validData.cohort) {
      await updateUserCohort(userId, validData.cohort);
    }

    console.log(`[user-update-handler] all updates complete for userid=${userId}`);
    return result;
  } catch (error) {
    console.log(`[user-update-handler] error in user update for userid=${userId}`, {
      error: error.message,
      stack: error.stack
    });
    throw error; // Re-throw to let framework handle it
  }
});
