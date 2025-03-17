import { and, eq } from 'drizzle-orm';
import { db } from '~db/client';
import { insertLocalContextSchema, localContexts } from '~db/schema/local-contexts';
import { LocalContext, UpsertLocalContextCommand } from '~myjournai/contexts-shared';

export async function upsertLocalContext(command: UpsertLocalContextCommand): Promise<LocalContext> {
  const { cohortId, content, weekNumber, year, id } = command;

  console.log(`[upsertLocalContext] upsert starting for cohort ${cohortId}, year ${year}, week ${weekNumber}` +
    (id ? `, id: ${id}` : ', creating new'));

  try {
    return await db.transaction(async (tx) => {
      // If id provided, check if record exists
      if (id) {
        console.log(`[upsertLocalContext] Looking for existing local context with id ${id}`);

        const existing = await tx.query.localContexts.findFirst({
          where: and(
            eq(localContexts.id, id),
            eq(localContexts.cohortId, cohortId)
          ),
        });

        if (existing) {
          console.log(`[upsertLocalContext] Found existing local context, updating content`);

          const result = await tx
            .update(localContexts)
            .set({
              content,
              weekNumber,
              year,
              updatedAt: new Date()
            })
            .where(
              and(
                eq(localContexts.id, id),
                eq(localContexts.cohortId, cohortId)
              )
            )
            .returning();

          console.log(`[upsertLocalContext] Local context updated successfully, id: ${result[0].id}`);
          return result[0];
        } else {
          console.log(`[upsertLocalContext] No existing local context found with id ${id}, will create new`);
        }
      }

      // Check if a context for this cohort, year, and week already exists
      console.log(`[upsertLocalContext] Checking for existing context with cohort ${cohortId}, year ${year}, week ${weekNumber}`);

      const existingByWeek = await tx.query.localContexts.findFirst({
        where: and(
          eq(localContexts.cohortId, cohortId),
          eq(localContexts.year, year),
          eq(localContexts.weekNumber, weekNumber)
        ),
      });

      if (existingByWeek) {
        console.log(`[upsertLocalContext] Found existing context for this week, updating instead of creating new`);

        const result = await tx
          .update(localContexts)
          .set({
            content,
            updatedAt: new Date()
          })
          .where(
            and(
              eq(localContexts.cohortId, cohortId),
              eq(localContexts.year, year),
              eq(localContexts.weekNumber, weekNumber)
            )
          )
          .returning();

        console.log(`[upsertLocalContext] Local context updated successfully, id: ${result[0].id}`);
        return result[0];
      }

      // Create new record
      const newRecord = {
        cohortId,
        content,
        weekNumber,
        year,
        ...(id ? { id } : {})
      };

      insertLocalContextSchema.parse(newRecord);

      console.log(`[upsertLocalContext] Creating new local context for cohort ${cohortId}, year ${year}, week ${weekNumber}`);

      const result = await tx
        .insert(localContexts)
        .values(newRecord)
        .returning();

      console.log(`[upsertLocalContext] Local context created successfully, id: ${result[0].id}`);
      return result[0];
    });
  } catch (error) {
    console.error(`[upsertLocalContext] Failed to upsert local context for cohort ${cohortId}:`, error);
    throw error;
  }
}
