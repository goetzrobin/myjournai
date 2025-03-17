// server/api/personal-contexts.post.ts
import { defineEventHandler, readBody } from 'h3';
import { upsertPersonalContextUseCase } from '~myjournai/contexts-server';
import { upsertPersonalContextSchema } from '~myjournai/contexts-shared';

export default defineEventHandler(async (event) => {
  console.log(`[personalContextsUpsert] Request received`)

  try {
    // Get request body
    const body = await readBody(event)
    console.log(`[personalContextsUpsert] Raw body:`, body)

    // Validate request body
    const validatedCommand = upsertPersonalContextSchema.parse(body)
    console.log(`[personalContextsUpsert] Validation passed for user ${validatedCommand.userId}`)

    // Execute upsert function
    console.log(`[personalContextsUpsert] Executing upsert...`)
    const result = await upsertPersonalContextUseCase(validatedCommand)

    // Log success
    console.log(`[personalContextsUpsert] Upsert successful, returned id: ${result.id}`)

    // Return result
    return {
      statusCode: 200,
      message: 'Personal context saved successfully',
      data: result
    }
  } catch (error: any) {
    // Simple error handling
    if (error.name === 'ZodError') {
      // Handle validation errors
      console.error(`[personalContextsUpsert] Validation error:`, JSON.stringify(error.issues))
      return {
        statusCode: 400,
        message: 'Invalid request body',
        issues: error.issues
      }
    }

    // Log server errors but don't expose details
    console.error(`[personalContextsUpsert] Error processing request:`, error)

    // Log stack trace for better debugging
    if (error.stack) {
      console.error(`[personalContextsUpsert] Stack trace:`, error.stack)
    }

    // Return appropriate error
    return {
      statusCode: 500,
      message: 'Failed to save personal context'
    }
  }

    // Always log when request ends
  finally {
    console.log(`[personalContextsUpsert] Request completed`)
  }
})
