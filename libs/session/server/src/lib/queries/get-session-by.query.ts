import { db } from '~db/client';
import { Session, sessions } from '~db/schema/sessions';
import { and, eq } from 'drizzle-orm';

export const getSessionBy = async ({ id, slug }: {
  id?: string;
  slug?: string
}): Promise<Session | undefined> => (await db.select().from(sessions).where(
  and(
    !slug ? undefined : eq(sessions.slug, slug),
    !id ? undefined : eq(sessions.id, id)
  )
).limit(1))?.[0];
