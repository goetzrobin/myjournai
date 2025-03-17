import { and, eq } from 'drizzle-orm';
import { db } from '~db/client';
import { globalContexts, insertGlobalContextSchema } from '~db/schema/global-contexts';
import { GlobalContext, UpsertGlobalContextCommand } from '~myjournai/contexts-shared';

export async function upsertGlobalContext(command: UpsertGlobalContextCommand): Promise<GlobalContext> {
  const { content, weekNumber, year, id } = command;

  console.log(`[upsertGlobalContext] upsert starting for year ${year}, week ${weekNumber}` +
    (id ? `, id: ${id}` : ', creating new'));

  try {
    return await db.transaction(async (tx) => {
      // If id provided, check if record exists
      if (id) {
        console.log(`[upsertGlobalContext] Looking for existing global context with id ${id}`);

        const existing = await tx.query.globalContexts.findFirst({
          where: eq(globalContexts.id, id)
        });

        if (existing) {
          console.log(`[upsertGlobalContext] Found existing global context, updating content`);

          const result = await tx
            .update(globalContexts)
            .set({
              content,
              weekNumber,
              year,
              updatedAt: new Date()
            })
            .where(eq(globalContexts.id, id))
            .returning();

          console.log(`[upsertGlobalContext] Global context updated successfully, id: ${result[0].id}`);
          return result[0];
        } else {
          console.log(`[upsertGlobalContext] No existing global context found with id ${id}, will create new`);
        }
      }

      // Check if a context for this year and week already exists
      console.log(`[upsertGlobalContext] Checking for existing context with year ${year}, week ${weekNumber}`);

      const existingByWeek = await tx.query.globalContexts.findFirst({
        where: and(
          eq(globalContexts.year, year),
          eq(globalContexts.weekNumber, weekNumber)
        ),
      });

      if (existingByWeek) {
        console.log(`[upsertGlobalContext] Found existing context for this week, updating instead of creating new`);

        const result = await tx
          .update(globalContexts)
          .set({
            content,
            updatedAt: new Date()
          })
          .where(
            and(
              eq(globalContexts.year, year),
              eq(globalContexts.weekNumber, weekNumber)
            )
          )
          .returning();

        console.log(`[upsertGlobalContext] Global context updated successfully, id: ${result[0].id}`);
        return result[0];
      }

      // Create new record
      const newRecord = {
        content,
        weekNumber,
        year,
        ...(id ? { id } : {})
      };

      insertGlobalContextSchema.parse(newRecord);

      console.log(`[upsertGlobalContext] Creating new global context for year ${year}, week ${weekNumber}`);

      const result = await tx
        .insert(globalContexts)
        .values(newRecord)
        .returning();

      console.log(`[upsertGlobalContext] Global context created successfully, id: ${result[0].id}`);
      return result[0];
    });
  } catch (error) {
    console.error(`[upsertGlobalContext] Failed to upsert global context:`, error);
    throw error;
  }
}
