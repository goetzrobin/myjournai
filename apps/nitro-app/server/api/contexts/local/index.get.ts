// server/api/local-contexts.get.ts
import { defineEventHandler, getQuery } from 'h3';
import { queryLocalContexts } from '~myjournai/contexts-server';
import { LocalContextsQueryParams, localContextsQuerySchema } from '~myjournai/contexts-shared';

export default defineEventHandler(async (event) => {
  console.log(`[localContexts] Request received`)

  try {
    // Get query parameters
    const rawQuery = getQuery(event)
    console.log(`[localContexts] Raw query params:`, rawQuery)

    // Parse and validate parameters
    const params: LocalContextsQueryParams = {
      cohortId: rawQuery.cohortId as string,
      cursor: rawQuery.cursor as string | undefined,
      limit: rawQuery.limit ? parseInt(rawQuery.limit as string, 10) : undefined,
      direction: (rawQuery.direction as 'forward' | 'backward' | undefined) || 'forward',
      year: rawQuery.year ? parseInt(rawQuery.year as string, 10) : undefined,
      weekNumber: rawQuery.weekNumber ? parseInt(rawQuery.weekNumber as string, 10) : undefined,
    }
    console.log(`[localContexts] Parsed params:`, params)

    // Validate using Zod schema
    const validatedParams = localContextsQuerySchema.parse(params)
    console.log(`[localContexts] Validation passed`)

    // Execute query function
    console.log(`[localContexts] Executing database query...`)
    const result = await queryLocalContexts(validatedParams)

    // Log success
    console.log(`[localContexts] Query successful, returning ${result.items.length} items`)

    // Return results
    return result
  } catch (error: any) {
    // Simple error handling
    if (error.name === 'ZodError') {
      // Handle validation errors
      console.error(`[localContexts] Validation error:`, JSON.stringify(error.issues))
      return {
        statusCode: 400,
        message: 'Invalid query parameters',
        issues: error.issues
      }
    }

    // Log server errors but don't expose details
    console.error(`[localContexts] Error processing request:`, error)

    // Log stack trace for better debugging
    if (error.stack) {
      console.error(`[localContexts] Stack trace:`, error.stack)
    }

    // Return appropriate error
    return {
      statusCode: 500,
      message: 'Failed to fetch local contexts'
    }
  }

    // Always log when request ends
  finally {
    console.log(`[localContexts] Request completed`)
  }
})
