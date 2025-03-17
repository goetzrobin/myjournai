import { and, asc, desc, eq, gt, lt, or } from 'drizzle-orm';
import { db } from '~db/client';
import { globalContexts } from '~db/schema/global-contexts';
import { GlobalContextsQueryParams, GlobalContextsQueryResult } from '~myjournai/contexts-shared';

export async function queryGlobalContexts(params: GlobalContextsQueryParams): Promise<GlobalContextsQueryResult> {
  const { cursor, limit, direction, year, weekNumber } = params;

  console.log(`[queryGlobalContexts] query starting with limit: ${limit}, direction: ${direction}` +
    (cursor ? `, cursor: ${cursor}` : '') +
    (year ? `, year: ${year}` : '') +
    (weekNumber ? `, week: ${weekNumber}` : ''));

  // Start with empty condition
  let query = and();

  // Add optional year/week filters
  if (year !== undefined) {
    query = and(query, eq(globalContexts.year, year));
  }

  if (weekNumber !== undefined) {
    query = and(query, eq(globalContexts.weekNumber, weekNumber));
  }

  // Parse cursor if provided
  let cursorYear: number | undefined;
  let cursorWeek: number | undefined;

  if (cursor) {
    try {
      const [yearStr, weekStr] = cursor.split('-');
      cursorYear = parseInt(yearStr, 10);
      cursorWeek = parseInt(weekStr, 10);

      if (isNaN(cursorYear) || isNaN(cursorWeek)) {
        throw new Error('Invalid cursor format');
      }

      console.log(`[queryGlobalContexts] Using cursor: year ${cursorYear}, week ${cursorWeek}`);
    } catch (error) {
      console.error(`[queryGlobalContexts] Invalid cursor format: ${cursor}`, error);
      throw new Error('Invalid cursor format. Expected "YYYY-WW"');
    }
  }

  // Add cursor conditions if provided
  if (cursorYear !== undefined && cursorWeek !== undefined) {
    if (direction === 'forward') {
      // For forward pagination, get older weeks
      query = and(
        query,
        or(
          // Either earlier year
          lt(globalContexts.year, cursorYear),
          // Or same year but earlier/equal week
          and(
            eq(globalContexts.year, cursorYear),
            lt(globalContexts.weekNumber, cursorWeek)
          )
        )
      );
    } else {
      // For backward pagination, get newer weeks
      query = and(
        query,
        or(
          // Either later year
          gt(globalContexts.year, cursorYear),
          // Or same year but later/equal week
          and(
            eq(globalContexts.year, cursorYear),
            gt(globalContexts.weekNumber, cursorWeek)
          )
        )
      );
    }
  }

  try {
    const results = await db.query.globalContexts.findMany({
      where: query,
      limit: limit + 1, // Get one extra to check if there are more items
      orderBy:
      // Default newest first (highest year, then highest week)
        direction === 'forward'
          ? [desc(globalContexts.year), desc(globalContexts.weekNumber)]
          : [asc(globalContexts.year), asc(globalContexts.weekNumber)]
    });

    console.log(`[queryGlobalContexts] query found ${results.length} results (including extra item for pagination)`);

    const hasMore = results.length > limit;
    // No need to reverse for backward pagination since we adjusted the orderBy
    const items = hasMore ? results.slice(0, limit) : results;

    // Create cursor from last item's year and week
    const nextCursor = hasMore && items.length > 0
      ? `${items[items.length - 1].year}-${items[items.length - 1].weekNumber.toString().padStart(2, '0')}`
      : null;

    const result: GlobalContextsQueryResult = {
      items,
      hasMore,
      nextCursor
    };

    console.log(`[queryGlobalContexts] query returning ${items.length} items, hasMore: ${hasMore}` +
      (result.nextCursor ? `, nextCursor: ${result.nextCursor}` : ''));

    return result;
  } catch (error) {
    console.error(`[queryGlobalContexts] query failed:`, error);
    throw error;
  }
}
