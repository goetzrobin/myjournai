import { UserOnboardingData } from '~myjournai/onboarding-shared';
import { db } from '~db/client';
import { users } from '~db/schema/users';
import { eq } from 'drizzle-orm';

export const updateUserOnboardingAction = async (userId: string, request: UserOnboardingData) => {
  await db.update(users).set(request).where(eq(users.id, userId));
};
