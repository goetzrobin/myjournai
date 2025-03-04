import { db } from '~db/client';
import { and, desc, eq } from 'drizzle-orm';
import { GlobalContext, globalContexts } from '~db/schema/global-contexts';
import { LocalContext, localContexts } from '~db/schema/local-contexts';
import { PersonalContext, personalContexts } from '~db/schema/personal-contexts';
import { cohorts } from '~db/schema/cohorts';
import { cohortsUsers } from '~db/schema/cohorts-users';

// Global context query
export type GlobalContextQueryParams = {
  weekNumber: number;
  year: number;
}

const queryLatestGlobalContext = async (
  params: GlobalContextQueryParams
): Promise<GlobalContext | undefined> => {
  console.log(`[QUERY] queryLatestGlobalContext called with:`, JSON.stringify(params));

  const [result] = await db.select()
    .from(globalContexts)
    .where(
      and(
        eq(globalContexts.weekNumber, params.weekNumber),
        eq(globalContexts.year, params.year)
      )
    )
    .orderBy(desc(globalContexts.createdAt))
    .limit(1);

  console.log(`[RESULT] Global context ${result ? 'found' : 'not found'}`);
  return result;
};

// Local context query
export type LocalContextQueryParams = {
  userId: string;
  weekNumber: number;
  year: number;
}

const queryLatestLocalContext = async (
  params: LocalContextQueryParams
): Promise<LocalContext | undefined> => {
  console.log(`[QUERY] queryLatestLocalContext called with:`, JSON.stringify(params));

  const [result]: LocalContext[] = await db.select({
    id: localContexts.id,
    content: localContexts.content,
    weekNumber: localContexts.weekNumber,
    year: localContexts.year,
    updatedAt: localContexts.updatedAt,
    createdAt: localContexts.createdAt,
    cohortId: localContexts.cohortId
  })
    .from(localContexts)
    .innerJoin(cohorts, eq(cohorts.id, localContexts.cohortId))
    .innerJoin(cohortsUsers, and(
        eq(cohortsUsers.cohortId, cohorts.id),
        eq(cohortsUsers.status, 'ACTIVE')
      )
    )
    .where(
      and(
        eq(cohortsUsers.userId, params.userId),
        eq(localContexts.weekNumber, params.weekNumber),
        eq(localContexts.year, params.year)
      )
    )
    .orderBy(desc(localContexts.createdAt))
    .limit(1);

  console.log(`[RESULT] Local context for user ${params.userId} ${result ? 'found' : 'not found'}`);
  return result;
};

// Personal context query
export type PersonalContextQueryParams = {
  userId: string;
}

const queryLatestPersonalContext = async (
  params: PersonalContextQueryParams
): Promise<PersonalContext | undefined> => {
  console.log(`[QUERY] queryLatestPersonalContext called with:`, JSON.stringify(params));

  const [result] = await db.select()
    .from(personalContexts)
    .where(
      eq(personalContexts.userId, params.userId)
    )
    .orderBy(desc(personalContexts.createdAt))
    .limit(1);

  console.log(`[RESULT] Personal context for user ${params.userId} ${result ? 'found' : 'not found'}`);
  return result;
};


export function getCurrentWeekAndYear() {
  // Get current date
  const now = new Date();

  // Create UTC date (remove time zone issues)
  const date = new Date(Date.UTC(
    now.getFullYear(),  // Current year
    now.getMonth(),     // Current month (0-11)
    now.getDate()       // Current day (1-31)
  ));

  // Change date to the Thursday in the current week
  // This is key to ISO week calculation because
  // by ISO 8601 definition, week 1 is the week with the first Thursday
  date.setUTCDate(
    date.getUTCDate() +      // Current day
    4 -                      // Move to Thursday (4)
    (date.getUTCDay() || 7)  // Based on current day of week (0-6, Sunday=0)
    // Convert Sunday from 0 to 7
  );

  // Get January 1st of the same year
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));

  // Calculate week number:
  // 1. Get time difference in milliseconds between Thursday and Jan 1st
  // 2. Convert to days by dividing by milliseconds in a day (86400000)
  // 3. Add 1 because we want to count from day 1
  // 4. Divide by 7 to get weeks
  // 5. Round up with Math.ceil to get full weeks
  const weekNumber = Math.ceil(
    (
      // Time difference in days + 1
      ((date.getTime() - yearStart.getTime()) / 86400000) + 1
    ) / 7
  );

  return {
    weekNumber: weekNumber,  // Week number (1-53)
    year: now.getFullYear()  // Current year
  };
}

// Format context block for mentor
export const queryContextBlock = async ({ userId, weekNumber, year }: {
  userId: string,
  weekNumber: number,
  year: number
}) => {
  console.log(`[QUERY] queryContextBlock called with:`, JSON.stringify({ userId, weekNumber, year }));

  // Get all contexts in parallel - much faster!
  const startTime = Date.now();

  const [personalContext, localContext, globalContext] = await Promise.all([
    queryLatestPersonalContext({ userId }),
    queryLatestLocalContext({ userId, weekNumber, year }),
    queryLatestGlobalContext({ weekNumber, year })
  ]);

  const queryTime = Date.now() - startTime;
  console.log(`[PERFORMANCE] All context queries completed in ${queryTime}ms`);

  // Format block - simple template string
  return `
Global Context:
${globalContext?.content || 'No global context found'}

Local Context (Cohort):
${localContext?.content || 'No local context found'}

Personal Context:
${personalContext?.content || 'No personal context found'}
  `;
};
