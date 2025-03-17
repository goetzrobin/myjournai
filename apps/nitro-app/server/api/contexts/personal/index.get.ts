// server/api/personal-contexts.get.ts
import { defineEventHandler, getQuery } from 'h3';
import { queryPersonalContexts } from '~myjournai/contexts-server';
import { PersonalContextsQueryParams, personalContextsQuerySchema } from '~myjournai/contexts-shared';

export default defineEventHandler(async (event) => {
  console.log(`[personalContexts] Request received`)

  try {
    // Get query parameters
    const rawQuery = getQuery(event)
    console.log(`[personalContexts] Raw query params:`, rawQuery)

    // Parse and validate parameters
    const params: PersonalContextsQueryParams = {
      userId: rawQuery.userId as string,
      cursor: rawQuery.cursor as string | undefined,
      limit: rawQuery.limit ? parseInt(rawQuery.limit as string, 10) : undefined,
      direction: (rawQuery.direction as 'forward' | 'backward' | undefined) || 'forward',
    }
    console.log(`[personalContexts] Parsed params:`, params)

    // Validate using Zod schema
    const validatedParams = personalContextsQuerySchema.parse(params)
    console.log(`[personalContexts] Validation passed`)

    // Execute query function
    console.log(`[personalContexts] Executing database query...`)
    const result = await queryPersonalContexts(validatedParams)

    // Log success
    console.log(`[personalContexts] Query successful, returning ${result.items.length} items`)

    // Return results
    return result
  } catch (error: any) {
    // Simple error handling
    if (error.name === 'ZodError') {
      // Handle validation errors
      console.error(`[personalContexts] Validation error:`, JSON.stringify(error.issues))
      return {
        statusCode: 400,
        message: 'Invalid query parameters',
        issues: error.issues
      }
    }

    // Log server errors but don't expose details
    console.error(`[personalContexts] Error processing request:`, error)

    // Log stack trace for better debugging
    if (error.stack) {
      console.error(`[personalContexts] Stack trace:`, error.stack)
    }

    // Return appropriate error
    return {
      statusCode: 500,
      message: 'Failed to fetch personal contexts'
    }
  }

    // Always log when request ends
  finally {
    console.log(`[personalContexts] Request completed`)
  }
})
