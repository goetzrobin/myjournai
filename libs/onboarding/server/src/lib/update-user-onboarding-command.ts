import { UserOnboardingData } from '~myjournai/onboarding-shared';
import { db } from '~db/client';
import { users } from '~db/schema/users';
import { eq } from 'drizzle-orm';
import { cohorts } from '~db/schema/cohorts';
import { cohortsUsers } from '~db/schema/cohorts-users';

export const updateUserOnboardingCommand = async (userId: string, request: UserOnboardingData) => {
  const existingCohorts = await db.select().from(cohorts);
  const cohortWithMatchingSlugIndex = existingCohorts.findIndex(c => c.slug === request.cohort);
  const cohortOtherIndex = existingCohorts.findIndex(c => c.slug === 'other');
  console.log(existingCohorts, request, cohortWithMatchingSlugIndex, cohortOtherIndex)
  if (cohortWithMatchingSlugIndex > -1) {
    await db.insert(cohortsUsers).values({
      cohortId: existingCohorts[cohortWithMatchingSlugIndex].id,
      userId,
      status: 'ACTIVE'
    });
  } else if (cohortOtherIndex > -1) {
    await db.insert(cohortsUsers).values({
      cohortId: existingCohorts[cohortOtherIndex].id,
      userId,
      otherName: request.cohort,
      status: 'ACTIVE'
    });
  }
  return db.update(users).set(request).where(eq(users.id, userId)).returning();
};
