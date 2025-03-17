import { personalContexts } from '~db/schema/personal-contexts';
import { db } from '~db/client';
import { and, asc, desc, eq, gt, lt } from 'drizzle-orm';
import { PersonalContextsQueryParams, PersonalContextsQueryResult } from '~myjournai/contexts-shared';

export async function queryPersonalContexts(params: PersonalContextsQueryParams): Promise<PersonalContextsQueryResult> {
  const { userId, cursor, limit, direction } = params;

  console.log(`[queryPersonalContexts] query starting for user ${userId}, limit: ${limit}, direction: ${direction}` + (cursor ? `, cursor: ${cursor}` : ''));

  let query = and(
    eq(personalContexts.userId, userId)
  );

  // Parse cursor if provided - cursor now contains timestamp
  let cursorDate: Date | undefined;
  if (cursor) {
    try {
      cursorDate = new Date(cursor);
      console.log(`[queryPersonalContexts] Using cursor date: ${cursorDate.toISOString()}`);
    } catch (error) {
      console.error(`[queryPersonalContexts] Invalid cursor format: ${cursor}`, error);
      throw new Error('Invalid cursor format');
    }
  }

  // Add cursor condition if provided
  if (cursorDate) {
    // For forward pagination (older items), get items created before cursor
    if (direction === 'forward') {
      query = and(
        query,
        lt(personalContexts.createdAt, cursorDate)
      );
    }
    // For backward pagination (newer items), get items created after cursor
    else {
      query = and(
        query,
        gt(personalContexts.createdAt, cursorDate)
      );
    }
  }

  try {
    const results = await db.query.personalContexts.findMany({
      where: query,
      limit: limit + 1, // Get one extra to check if there are more items
      orderBy: [
        // Most recent first by default, direction affects the logic
        direction === 'forward'
          ? desc(personalContexts.createdAt)
          : asc(personalContexts.createdAt)
      ]
    });

    console.log(`[queryPersonalContexts] query found ${results.length} results (including extra item for pagination)`);

    const hasMore = results.length > limit;
    const contexts = hasMore ? results.slice(0, limit) : results;

    const items = direction === 'backward' ? contexts.reverse() : contexts;

    const lastDate = items[items.length - 1].createdAt
    const result: PersonalContextsQueryResult = {
      items,
      hasMore,
      nextCursor: hasMore && items.length > 0 && lastDate ? lastDate.toISOString() : null,
    };

    console.log(`[queryPersonalContexts] query returning ${items.length} items, hasMore: ${hasMore}` +
      (result.nextCursor ? `, nextCursor: ${result.nextCursor}` : ''));

    return result;
  } catch (error) {
    console.error(`[queryPersonalContexts] query failed for user ${userId}:`, error);
    throw error;
  }
}
