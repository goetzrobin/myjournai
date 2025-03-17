import { and, eq } from 'drizzle-orm';
import { db } from '~db/client';
import { insertPersonalContextSchema, PersonalContext, personalContexts } from '~db/schema/personal-contexts';
import { UpsertPersonalContextCommand } from '~myjournai/contexts-shared';


export async function upsertPersonalContextUseCase(command: UpsertPersonalContextCommand): Promise<PersonalContext> {
  const { userId, content, id } = command;

  console.log(`[upsertPersonalContextUseCase] upsert starting for user ${userId}` + (id ? `, id: ${id}` : ', creating new'));

  try {
    return await db.transaction(async (tx) => {
      if (id) {
        console.log(`[upsertPersonalContextUseCase] Looking for existing personal context with id ${id}`);

        const existing = await tx.query.personalContexts.findFirst({
          where: and(
            eq(personalContexts.id, id),
            eq(personalContexts.userId, userId)
          ),
        });

        if (existing) {
          console.log(`[upsertPersonalContextUseCase] Found existing personal context, updating content`);

          const result = await tx
            .update(personalContexts)
            .set({
              content,
              updatedAt: new Date()
            })
            .where(
              and(
                eq(personalContexts.id, id),
                eq(personalContexts.userId, userId)
              )
            )
            .returning();

          console.log(`[upsertPersonalContextUseCase] Personal context updated successfully, id: ${result[0].id}`);
          return result[0];
        } else {
          console.log(`[upsertPersonalContextUseCase] No existing personal context found with id ${id}, will create new`);
        }
      }

      const newRecord = {
        userId,
        content,
        ...(id ? { id } : {})
      };

      insertPersonalContextSchema.parse(newRecord);

      console.log(`[upsertPersonalContextUseCase] Creating new personal context for user ${userId}`);

      const result = await tx
        .insert(personalContexts)
        .values(newRecord)
        .returning();

      console.log(`[upsertPersonalContextUseCase] Personal context created successfully, id: ${result[0].id}`);
      return result[0];
    });
  } catch (error) {
    console.error(`[upsertPersonalContextUseCase] Failed to upsert personal context for user ${userId}:`, error);
    throw error;
  }
}
