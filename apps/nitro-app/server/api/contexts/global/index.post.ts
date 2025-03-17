// server/api/global-contexts.post.ts
import { defineEventHandler, readBody } from 'h3';
import { upsertGlobalContext } from '~myjournai/contexts-server';
import { upsertGlobalContextSchema } from '~myjournai/contexts-shared';

export default defineEventHandler(async (event) => {
  const requestId = Math.random().toString(36).substring(2, 10)
  console.log(`[globalContextsUpsert] Request received`)

  try {
    // Get request body
    const body = await readBody(event)
    console.log(`[globalContextsUpsert] Raw body:`, body)

    // Validate request body
    const validatedCommand = upsertGlobalContextSchema.parse(body)
    console.log(`[globalContextsUpsert] Validation passed for year ${validatedCommand.year}, week ${validatedCommand.weekNumber}`)

    // Execute upsert function
    console.log(`[globalContextsUpsert] Executing upsert...`)
    const result = await upsertGlobalContext(validatedCommand)

    // Log success
    console.log(`[globalContextsUpsert] Upsert successful, returned id: ${result.id}`)

    // Return result
    return {
      statusCode: 200,
      message: 'Global context saved successfully',
      data: result
    }
  } catch (error: any) {
    // Simple error handling
    if (error.name === 'ZodError') {
      // Handle validation errors
      console.error(`[globalContextsUpsert] Validation error:`, JSON.stringify(error.issues))
      return {
        statusCode: 400,
        message: 'Invalid request body',
        issues: error.issues
      }
    }

    // Log server errors but don't expose details
    console.error(`[globalContextsUpsert] Error processing request:`, error)

    // Log stack trace for better debugging
    if (error.stack) {
      console.error(`[globalContextsUpsert] Stack trace:`, error.stack)
    }

    // Return appropriate error
    return {
      statusCode: 500,
      message: 'Failed to save global context'
    }
  }

    // Always log when request ends
  finally {
    console.log(`[globalContextsUpsert] Request completed`)
  }
})
