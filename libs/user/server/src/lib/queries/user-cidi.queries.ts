import { db } from '~db/client';
import { CidiSurveyResponses, cidiSurveyResponses } from '~db/schema/cidi-survey-responses';
import { and, eq } from 'drizzle-orm';
import { likertScale } from '../likert-utils';

export type CidiSurveyResponseQueryParams = { userId: string; type?: 'PRE' | 'POST' }
export const queryUserCidiSurveyResponsesBy = async ({
                                                       userId,
                                                       type
                                                     }: CidiSurveyResponseQueryParams): Promise<CidiSurveyResponses | undefined> => {
  const query = db.select().from(cidiSurveyResponses).where(
    and(
      eq(cidiSurveyResponses.type, type ?? 'PRE'),
      eq(cidiSurveyResponses.userId, userId)
    )
  ).orderBy(cidiSurveyResponses.createdAt).limit(1);
  console.log(query.toSQL().params);
  const [result] = await query;
  return result;
};

export const createCidiConfusionBlock = (cidiResponse?: CidiSurveyResponses): string => !cidiResponse ? `` : `
Feel confused as to who I really am when it comes to my career: ${likertScale[cidiResponse.question10 ?? 3]}
Am uncertain about the kind of work I could perform well: ${likertScale[cidiResponse.question11 ?? 3]}
Deciding on a career makes me feel anxious: ${likertScale[cidiResponse.question12 ?? 3]}
Often feel lost when I think about choosing a career because I don’t have enough information and/or experience to make a career decision at this point: ${likertScale[cidiResponse.question13 ?? 3]}
Trying to find a satisfying career is stressful because there are so many things to consider: ${likertScale[cidiResponse.question14 ?? 3]}
Being unsure about what kind of career I would enjoy worries me: ${likertScale[cidiResponse.question15 ?? 3]}
Have doubts that I will be able to find a career that I’m satisfied with: ${likertScale[cidiResponse.question16 ?? 3]}
Have no clear sense of a career direction that would be meaningful to me: ${likertScale[cidiResponse.question17 ?? 3]}`;
export const createCidiResultsBlock = (cidiResponse?: CidiSurveyResponses): string => !cidiResponse ? `No career identity data available` : `
${createCidiConfusionBlock(cidiResponse)}

Learn about myself for the purpose of finding a career that meets my needs: ${likertScale[cidiResponse.question20 ?? 3]}
Reflect on how my past could integrate with various career alternatives: ${likertScale[cidiResponse.question21 ?? 3]}
Think about which career options would be a good fit with my personality and values: ${likertScale[cidiResponse.question22 ?? 3]}
Reflect on how my strengths and abilities could be best used in a variety of careers: ${likertScale[cidiResponse.question23 ?? 3]}

Reflect on how my chosen career aligns with my past experiences: ${likertScale[cidiResponse.question30 ?? 3]}
Contemplate what I value most in my desired career: ${likertScale[cidiResponse.question31 ?? 3]}
Contemplate how the work I want to do is congruent with my interests and personality: ${likertScale[cidiResponse.question32 ?? 3]}
Reflect on how my strengths and abilities could be best used in my desired career: ${likertScale[cidiResponse.question33 ?? 3]}

Thought about which career options would be a good fit with my personality and values: ${likertScale[cidiResponse.question40 ?? 3]}
Reflected on how my strengths and abilities could be best used in a variety of careers: ${likertScale[cidiResponse.question41 ?? 3]}

My career of interest is one of the most important aspects of my life: ${likertScale[cidiResponse.question50 ?? 3]}
Can say that I have found my purpose in life through my career of interest: ${likertScale[cidiResponse.question51 ?? 3]}
My career of interest gives meaning to my life: ${likertScale[cidiResponse.question52 ?? 3]}
My career plans match my true interests and values: ${likertScale[cidiResponse.question53 ?? 3]}
  `;
