import { db } from '~db/client';
import { users } from '~db/schema/users';
import { eq } from 'drizzle-orm';
import { UserQR } from '~myjournai/user-shared';

export type UserQueryParams = {id: string}
export const queryUserBy = async ({id}: UserQueryParams): Promise<UserQR | undefined> => {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return user;
}
