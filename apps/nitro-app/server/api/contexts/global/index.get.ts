// server/api/global-contexts.get.ts
import { defineEventHandler, getQuery } from 'h3';
import { queryGlobalContexts } from '~myjournai/contexts-server';
import { GlobalContextsQueryParams, globalContextsQuerySchema } from '~myjournai/contexts-shared';

export default defineEventHandler(async (event) => {
  console.log(`[globalContexts] Request received`)

  try {
    // Get query parameters
    const rawQuery = getQuery(event)
    console.log(`[globalContexts] Raw query params:`, rawQuery)

    // Parse and validate parameters
    const params: GlobalContextsQueryParams = {
      cursor: rawQuery.cursor as string | undefined,
      limit: rawQuery.limit ? parseInt(rawQuery.limit as string, 10) : undefined,
      direction: (rawQuery.direction as 'forward' | 'backward' | undefined) || 'forward',
      year: rawQuery.year ? parseInt(rawQuery.year as string, 10) : undefined,
      weekNumber: rawQuery.weekNumber ? parseInt(rawQuery.weekNumber as string, 10) : undefined,
    }
    console.log(`[globalContexts] Parsed params:`, params)

    // Validate using Zod schema
    const validatedParams = globalContextsQuerySchema.parse(params)
    console.log(`[globalContexts] Validation passed`)

    // Execute query function
    console.log(`[globalContexts] Executing database query...`)
    const result = await queryGlobalContexts(validatedParams)

    // Log success
    console.log(`[globalContexts] Query successful, returning ${result.items.length} items`)

    // Return results
    return result
  } catch (error: any) {
    // Simple error handling
    if (error.name === 'ZodError') {
      // Handle validation errors
      console.error(`[globalContexts] Validation error:`, JSON.stringify(error.issues))
      return {
        statusCode: 400,
        message: 'Invalid query parameters',
        issues: error.issues
      }
    }

    // Log server errors but don't expose details
    console.error(`[globalContexts] Error processing request:`, error)

    // Log stack trace for better debugging
    if (error.stack) {
      console.error(`[globalContexts] Stack trace:`, error.stack)
    }

    // Return appropriate error
    return {
      statusCode: 500,
      message: 'Failed to fetch global contexts'
    }
  }

    // Always log when request ends
  finally {
    console.log(`[globalContexts] Request completed`)
  }
})
