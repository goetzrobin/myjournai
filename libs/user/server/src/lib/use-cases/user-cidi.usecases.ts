import { db } from '~db/client';
import { cidiSurveyResponses, insertCidiSurveyResponsesSchema } from '~db/schema/cidi-survey-responses';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { queryUserCidiSurveyResponsesBy } from '../queries/user-cidi.queries';

export const createOrUpdateUserCidiResponseUsecase = async (data: CreateUserCidiResponseCommand) => {
  const existingResponseRecords = await queryUserCidiSurveyResponsesBy({userId: data.userId});
  if (existingResponseRecords) {
    return db.update(cidiSurveyResponses).set({ ...data, type: 'PRE', updatedAt: new Date() }).where(eq(
      cidiSurveyResponses.id, existingResponseRecords.id)).returning();
  }
  return db.insert(cidiSurveyResponses).values({ ...data, type: 'PRE' }).returning();
};

export const createUserCidiResponseCommandSchema = insertCidiSurveyResponsesSchema;
export type CreateUserCidiResponseCommand = z.infer<typeof createUserCidiResponseCommandSchema>;
