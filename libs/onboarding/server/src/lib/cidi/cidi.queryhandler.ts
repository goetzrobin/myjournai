import { db } from '~db/client';
import { and, eq } from 'drizzle-orm';
import { cidiSurveyResponses, CidiSurveyType } from '~db/schema/cidi-survey-responses';
import { CidiSurveyResponsesQR } from '~myjournai/onboarding-shared';

export type CidiQueryParams = { userId: string, type: CidiSurveyType }
export const queryCidiSurveyResponsesBy = async ({ userId, type }: CidiQueryParams):
  Promise<CidiSurveyResponsesQR | undefined> => {
  const [user] = await db.select().from(cidiSurveyResponses).where(
    and(eq(cidiSurveyResponses.userId, userId),
      eq(cidiSurveyResponses.type, type)
    )
  ).limit(1);
  return user;
};
