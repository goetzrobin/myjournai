import { db } from '~db/client';
import { eq } from 'drizzle-orm';
import { UserUpdateRequest } from '@myjournai/user-shared';
import { users } from '~db/schema/users';

export const updateUserAction = async (userId: string, request: UserUpdateRequest) => {
  await db.update(users).set(request).where(eq(users.id, userId));
};
