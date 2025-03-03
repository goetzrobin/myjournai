import { db } from '~db/client';
import { eq } from 'drizzle-orm';
import { UserUpdateRequest } from '~myjournai/user-shared';
import { users } from '~db/schema/users';

export const updateUserUsecase = async (userId: string, request: UserUpdateRequest) => {
  return db.update(users).set(request).where(eq(users.id, userId)).returning();
};
