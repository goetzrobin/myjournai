import { db } from '~db/client';
import { CidiSurveyResponses, cidiSurveyResponses } from '~db/schema/cidi-survey-responses';
import { and, eq } from 'drizzle-orm';

export type CidiSurveyResponseQueryParams = { userId: string }
export const queryUserCidiSurveyResponsesBy = async ({ userId }: CidiSurveyResponseQueryParams): Promise<CidiSurveyResponses | undefined> => {
  const [result]= await db.select().from(cidiSurveyResponses).where(
    and(
      eq(cidiSurveyResponses.type, 'PRE'),
      eq(cidiSurveyResponses.userId, userId)
    )
  ).limit(1);
  return result;
};
