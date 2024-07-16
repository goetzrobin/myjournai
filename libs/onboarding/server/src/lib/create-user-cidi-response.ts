import { db } from '~db/client';
import {
  cidiSurveyResponses,
  insertCidiSurveyResponsesSchema
} from '~db/schema/cidi-survey-responses';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

export const createOrUpdateUserCidiResponse = async (data: CreateUserCidiResponseRequest) => {
  const existingResponseRecords =
    await db.select().from(cidiSurveyResponses).where(
      and(
        eq(cidiSurveyResponses.type, 'PRE'),
        eq(cidiSurveyResponses.user_id, data.user_id)
      )
    );
  if (existingResponseRecords.length > 0) {
    return db.update(cidiSurveyResponses).set({ ...data, type: 'PRE' }).where(eq(
      cidiSurveyResponses.id, existingResponseRecords[0].id)).returning();
  }
  return db.insert(cidiSurveyResponses).values({ ...data, type: 'PRE' }).returning();
};

export const createUserCidiResponseRequestSchema = insertCidiSurveyResponsesSchema;
export type CreateUserCidiResponseRequest = z.infer<typeof createUserCidiResponseRequestSchema>;
