import { defineEventHandler, getQuery } from 'h3';
import { queryCohorts } from '~myjournai/cohorts-server';
import { CohortsQueryParams, cohortsQuerySchema } from '~myjournai/cohorts-shared';

export default defineEventHandler(async (event) => {
  console.log(`[cohorts] Request received`);

  try {
    // Get query parameters
    const rawQuery = getQuery(event);
    console.log(`[cohorts] Raw query params:`, rawQuery);

    // Parse cursor parameter
    let cursor: string | undefined = undefined;

    // If createdAt and/or slug are provided in the query, construct a cursor
    if (rawQuery.createdAt || rawQuery.slug) {
      const dateStr = rawQuery.createdAt ?
        (new Date(rawQuery.createdAt as string)).toISOString() : 'null';
      const slug = rawQuery.slug as string || '';
      cursor = `${dateStr}|${slug}`;
      console.log(`[cohorts] Constructed cursor from components: ${cursor}`);
    }
    // Otherwise use cursor if directly provided
    else if (rawQuery.cursor) {
      cursor = rawQuery.cursor as string;
    }

    // Parse and validate parameters
    const params: CohortsQueryParams = {
      cursor,
      limit: rawQuery.limit ? parseInt(rawQuery.limit as string, 10) : undefined,
      direction: (rawQuery.direction as 'forward' | 'backward' | undefined) || 'forward',
    };
    console.log(`[cohorts] Parsed params:`, params);

    // Validate using Zod schema
    const validatedParams = cohortsQuerySchema.parse(params);
    console.log(`[cohorts] Validation passed`);

    // Execute query function
    console.log(`[cohorts] Executing database query...`);
    const result = await queryCohorts(validatedParams);

    // Process result to include parsed cursor components for client convenience
    const processedResult = {
      ...result,
      cursorComponents: result.nextCursor ? parseCursorComponents(result.nextCursor) : null
    };

    // Log success
    console.log(`[cohorts] Query successful, returning ${result.items.length} items`);

    // Return results with processed cursor
    return processedResult;
  } catch (error: any) {
    // Simple error handling
    if (error.name === 'ZodError') {
      // Handle validation errors
      console.error(`[cohorts] Validation error:`, JSON.stringify(error.issues));
      return {
        statusCode: 400,
        message: 'Invalid query parameters',
        issues: error.issues
      };
    }

    // Log server errors but don't expose details
    console.error(`[cohorts] Error processing request:`, error);

    // Log stack trace for better debugging
    if (error.stack) {
      console.error(`[cohorts] Stack trace:`, error.stack);
    }

    // Return appropriate error
    return {
      statusCode: 500,
      message: 'Failed to fetch cohorts'
    };
  } finally {
    // Always log when request ends
    console.log(`[cohorts] Request completed`);
  }
});

// Helper function to parse cursor into components
function parseCursorComponents(cursor: string) {
  try {
    const [dateStr, slug] = cursor.split('|');

    return {
      createdAt: dateStr && dateStr !== 'null' ? new Date(dateStr) : null,
      slug: slug || ''
    };
  } catch (e) {
    console.error('[cohorts] Error parsing cursor:', e);
    return {
      createdAt: null,
      slug: ''
    };
  }
}
