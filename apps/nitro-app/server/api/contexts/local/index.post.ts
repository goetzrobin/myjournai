// server/api/local-contexts.post.ts
import { defineEventHandler, readBody } from 'h3';
import { upsertLocalContext } from '~myjournai/contexts-server';
import { upsertLocalContextSchema } from '~myjournai/contexts-shared';

export default defineEventHandler(async (event) => {
  console.log(`[localContextsUpsert] Request received`)

  try {
    // Get request body
    const body = await readBody(event)
    console.log(`[localContextsUpsert] Raw body:`, body)

    // Validate request body
    const validatedCommand = upsertLocalContextSchema.parse(body)
    console.log(`[localContextsUpsert] Validation passed for cohort ${validatedCommand.cohortId}, year ${validatedCommand.year}, week ${validatedCommand.weekNumber}`)

    // Execute upsert function
    console.log(`[localContextsUpsert] Executing upsert...`)
    const result = await upsertLocalContext(validatedCommand)

    // Log success
    console.log(`[localContextsUpsert] Upsert successful, returned id: ${result.id}`)

    // Return result
    return {
      statusCode: 200,
      message: 'Local context saved successfully',
      data: result
    }
  } catch (error: any) {
    // Simple error handling
    if (error.name === 'ZodError') {
      // Handle validation errors
      console.error(`[localContextsUpsert] Validation error:`, JSON.stringify(error.issues))
      return {
        statusCode: 400,
        message: 'Invalid request body',
        issues: error.issues
      }
    }

    // Log server errors but don't expose details
    console.error(`[localContextsUpsert] Error processing request:`, error)

    // Log stack trace for better debugging
    if (error.stack) {
      console.error(`[localContextsUpsert] Stack trace:`, error.stack)
    }

    // Return appropriate error
    return {
      statusCode: 500,
      message: 'Failed to save local context'
    }
  }

    // Always log when request ends
  finally {
    console.log(`[localContextsUpsert] Request completed`)
  }
})
