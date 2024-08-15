import { createError } from 'h3';
import { createUserProfile } from '@myjournai/user-server';
import { likertScale, queryUserCidiSurveyResponsesBy } from '~myjournai/onboarding-server';
import { useRuntimeConfig } from 'nitropack/runtime';

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId');
  if (userId !== event.context.user?.id) {
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      message: 'Can only create profile for yourself'
    });
  }

  const cidiResponse = await queryUserCidiSurveyResponsesBy({userId})
  const cidiResults = `
Feel confused as to who I really am when it comes to my career: ${likertScale[cidiResponse.question10 ?? 3]}
Am uncertain about the kind of work I could perform well: ${likertScale[cidiResponse.question11 ?? 3]}
Deciding on a career makes me feel anxious: ${likertScale[cidiResponse.question12 ?? 3]}
Often feel lost when I think about choosing a career because I don’t have enough information and/or experience to make a career decision at this point: ${likertScale[cidiResponse.question13 ?? 3]}
Trying to find a satisfying career is stressful because there are so many things to consider: ${likertScale[cidiResponse.question14 ?? 3]}
Being unsure about what kind of career I would enjoy worries me: ${likertScale[cidiResponse.question15 ?? 3]}
Have doubts that I will be able to find a career that I’m satisfied with: ${likertScale[cidiResponse.question16 ?? 3]}
Have no clear sense of a career direction that would be meaningful to me: ${likertScale[cidiResponse.question17 ?? 3]}

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

  const { openApiKey } = useRuntimeConfig(event);
  const [newProfile] = await createUserProfile(userId, cidiResults, openApiKey);
  return newProfile;
});
