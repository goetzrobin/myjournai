import { and, asc, desc, eq, gt, lt, or } from 'drizzle-orm';
import { db } from '~db/client';
import { localContexts } from '~db/schema/local-contexts';


export async function queryLocalContexts(params: LocalContextsQueryParams): Promise<LocalContextsQueryResult> {
  const { cohortId, cursor, limit, direction, year, weekNumber } = params;

  console.log(`[queryLocalContexts] query starting for cohort ${cohortId}, limit: ${limit}, direction: ${direction}` +
    (cursor ? `, cursor: ${cursor}` : '') +
    (year ? `, year: ${year}` : '') +
    (weekNumber ? `, week: ${weekNumber}` : ''));

  // Always filter by cohortId
  let query = and(
    eq(localContexts.cohortId, cohortId)
  );

  // Add optional year/week filters
  if (year !== undefined) {
    query = and(query, eq(localContexts.year, year));
  }

  if (weekNumber !== undefined) {
    query = and(query, eq(localContexts.weekNumber, weekNumber));
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

      console.log(`[queryLocalContexts] Using cursor: year ${cursorYear}, week ${cursorWeek}`);
    } catch (error) {
      console.error(`[queryLocalContexts] Invalid cursor format: ${cursor}`, error);
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
          lt(localContexts.year, cursorYear),
          // Or same year but earlier/equal week
          and(
            eq(localContexts.year, cursorYear),
            lt(localContexts.weekNumber, cursorWeek)
          )
        )
      );
    } else {
      // For backward pagination, get newer weeks
      query = and(
        query,
        or(
          // Either later year
          gt(localContexts.year, cursorYear),
          // Or same year but later/equal week
          and(
            eq(localContexts.year, cursorYear),
            gt(localContexts.weekNumber, cursorWeek)
          )
        )
      );
    }
  }

  try {
    const results = await db.query.localContexts.findMany({
      where: query,
      limit: limit + 1, // Get one extra to check if there are more items
      orderBy:
        // Default newest first (highest year, then highest week)
        direction === 'forward'
          ? [desc(localContexts.year), desc(localContexts.weekNumber)]
          : [asc(localContexts.year), asc(localContexts.weekNumber)]
    });

    console.log(`[queryLocalContexts] query found ${results.length} results (including extra item for pagination)`);

    const hasMore = results.length > limit;
    const contexts = hasMore ? results.slice(0, limit) : results;

    // No need to reverse for backward pagination since we adjusted the orderBy
    const items = contexts;

    // Create cursor from last item's year and week
    const nextCursor = hasMore && items.length > 0
      ? `${items[items.length - 1].year}-${items[items.length - 1].weekNumber.toString().padStart(2, '0')}`
      : null;

    const result: LocalContextsQueryResult = {
      items,
      hasMore,
      nextCursor
    };

    console.log(`[queryLocalContexts] query returning ${items.length} items, hasMore: ${hasMore}` +
      (result.nextCursor ? `, nextCursor: ${result.nextCursor}` : ''));

    return result;
  } catch (error) {
    console.error(`[queryLocalContexts] query failed for cohort ${cohortId}:`, error);
    throw error;
  }
}
