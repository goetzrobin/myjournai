import { and, asc, desc, eq, gt, isNotNull, isNull, lt, or } from 'drizzle-orm';
import { db } from '~db/client';
import { cohorts } from '~db/schema/cohorts';
import { CohortsQueryParams, CohortsQueryResult } from '~myjournai/cohorts-shared';

export async function queryCohorts(params: CohortsQueryParams): Promise<CohortsQueryResult> {
  const { cursor, limit = 10, direction = 'forward' } = params;

  console.log(`[queryCohorts] query starting with limit: ${limit}, direction: ${direction}` +
    (cursor ? `, cursor: ${cursor}` : ''));

  // Start with empty condition
  let query = and();

  // Parse cursor if provided
  let cursorDate: Date | undefined;
  let cursorSlug: string | undefined;

  if (cursor) {
    try {
      // Cursor format: ISO date + delimiter + slug
      // Example: "2023-01-15T12:30:45.000Z|my-cohort-slug"
      const [dateStr, slug] = cursor.split('|');

      if (dateStr && dateStr !== 'null') {
        cursorDate = new Date(dateStr);
        if (isNaN(cursorDate.getTime())) {
          throw new Error('Invalid date in cursor');
        }
      }

      cursorSlug = slug || undefined;

      console.log(`[queryCohorts] Using cursor: date ${cursorDate?.toISOString() || 'null'}, slug ${cursorSlug || 'null'}`);
    } catch (error) {
      console.error(`[queryCohorts] Invalid cursor format: ${cursor}`, error);
      throw new Error('Invalid cursor format. Expected "ISO_DATE|slug"');
    }
  }

  // Add cursor conditions if provided
  if (cursor) {
    if (direction === 'forward') {
      // For forward pagination, get older items
      if (cursorDate) {
        query = and(
          query,
          or(
            // Either earlier creation date
            lt(cohorts.createdAt, cursorDate),
            isNull(cohorts.createdAt),
            // Or same date but different slug
            and(
              eq(cohorts.createdAt, cursorDate),
              cursorSlug ? lt(cohorts.slug, cursorSlug) : and()
            )
          )
        );
      } else if (cursorSlug) {
        // If no date, just use slug
        query = and(query, lt(cohorts.slug, cursorSlug));
      }
    } else {
      // For backward pagination, get newer items
      if (cursorDate) {
        query = and(
          query,
          or(
            // Either later creation date (exclude nulls)
            and(
              gt(cohorts.createdAt, cursorDate),
              isNotNull(cohorts.createdAt)
            ),
            // Or same date but different slug
            and(
              eq(cohorts.createdAt, cursorDate),
              cursorSlug ? gt(cohorts.slug, cursorSlug) : and()
            )
          )
        );
      } else if (cursorSlug) {
        // If no date, just use slug
        query = and(query, gt(cohorts.slug, cursorSlug));
      }
    }
  }

  try {
    const results = await db.query.cohorts.findMany({
      where: query,
      limit: limit + 1, // Get one extra to check if there are more items
      orderBy:
        // Default newest first, handles null createdAt
        direction === 'forward'
          ? [desc(cohorts.createdAt), desc(cohorts.slug)]
          : [asc(cohorts.createdAt), asc(cohorts.slug)]

    });

    console.log(`[queryCohorts] query found ${results.length} results (including extra item for pagination)`);

    const hasMore = results.length > limit;
    const items = hasMore ? results.slice(0, limit) : results;

    // Get the last item for cursor creation
    const lastItem = items.length > 0 ? items[items.length - 1] : null;

    // Create cursor from last item's creation date and slug
    const nextCursor = lastItem && hasMore
      ? `${lastItem.createdAt?.toISOString() || 'null'}|${lastItem.slug || ''}`
      : null;

    const result: CohortsQueryResult = {
      items,
      hasMore,
      nextCursor
    };

    console.log(`[queryCohorts] query returning ${items.length} items, hasMore: ${hasMore}` +
      (result.nextCursor ? `, nextCursor: ${result.nextCursor}` : ''));

    return result;
  } catch (error) {
    console.error(`[queryCohorts] query failed:`, error);
    throw error;
  }
}
