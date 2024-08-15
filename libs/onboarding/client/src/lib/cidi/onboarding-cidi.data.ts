import { OnboardingActualAnswer, OnboardingPossibleAnswer, OnboardingSurvey } from '../onboarding-survey';

const createAnswersArray = (size: number) => {
  const a: (OnboardingActualAnswer | undefined)[] = [];
  let total = size;
  while (total--) a.push({
    value: 3,
    type: 'fixed'
  });
  return a;
};
const LIKERT_ANSWERS: OnboardingPossibleAnswer[] = [
  {
    type: 'fixed',
    value: 1,
    label: 'Strongly Disagree'
  },
  {
    type: 'fixed',
    value: 2,
    label: 'Disagree'
  },
  {
    type: 'fixed',
    value: 3,
    label: 'Neither agree nor disagree'
  },
  {
    type: 'fixed',
    value: 4,
    label: 'Agree'
  },
  {
    type: 'fixed',
    value: 5,
    label: 'Strongly Agree'
  }
];

export const ONBOARDING_CIDI_CAREER_IDENTITY_CONFUSION_SURVEY: OnboardingSurvey = {
  questions: [
    {
      index: 0,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'Feel confused as to who I really am when it comes to my career',
      type: 'multiple-choice'
    },
    {
      index: 1,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'Am uncertain about the kind of work I could perform well',
      type: 'multiple-choice'
    },
    {
      index: 2,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'Deciding on a career makes me feel anxious',
      type: 'multiple-choice'
    },
    {
      index: 3,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'Often feel lost when I think about choosing a career because I don’t have enough information and/or experience to make a career decision at this point',
      type: 'multiple-choice'
    },
    {
      index: 4,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'Trying to find a satisfying career is stressful because there are so many things to consider',
      type: 'multiple-choice'
    },
    {
      index: 5,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'Being unsure about what kind of career I would enjoy worries me',
      type: 'multiple-choice'
    },
    {
      index: 6,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'Have doubts that I will be able to find a career that I’m satisfied with',
      type: 'multiple-choice'
    },
    {
      index: 7,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'Have no clear sense of a career direction that would be meaningful to me',
      type: 'multiple-choice'
    }
  ],
  answers: createAnswersArray(8),
};

export const ONBOARDING_CIDI_CAREER_EXPLORATION_BREADTH_SELF_SURVEY: OnboardingSurvey = {
  questions: [
    {
      index: 0,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'Learn about myself for the purpose of finding a career that meets my needs',
      type: 'multiple-choice'
    },
    {
      index: 1,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'Reflect on how my past could integrate with various career alternatives',
      type: 'multiple-choice'
    },
    {
      index: 2,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'Think about which career options would be a good fit with my personality and values',
      type: 'multiple-choice'
    },
    {
      index: 3,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'Reflect on how my strengths and abilities could be best used in a variety of careers',
      type: 'multiple-choice'
    },
  ],
  answers: createAnswersArray(4),
};

export const ONBOARDING_CIDI_CAREER_EXPLORATION_DEPTH_SELF_SURVEY: OnboardingSurvey = {
  questions: [
    {
      index: 0,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'Reflect on how my chosen career aligns with my past experiences',
      type: 'multiple-choice'
    },
    {
      index: 1,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'Contemplate what I value most in my desired career',
      type: 'multiple-choice'
    },
    {
      index: 2,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'Contemplate how the work I want to do is congruent with my interests and personality',
      type: 'multiple-choice'
    },
    {
      index: 3,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'Reflect on how my strengths and abilities could be best used in my desired career',
      type: 'multiple-choice'
    },
  ],
  answers: createAnswersArray(4),
};

export const ONBOARDING_CIDI_PAST_CAREER_EXPLORATION_BREADTH_SELF_SURVEY: OnboardingSurvey = {
  questions: [
    {
      index: 0,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'Thought about which career options would be a good fit with my personality and values',
      type: 'multiple-choice'
    },
    {
      index: 1,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'Reflected on how my strengths and abilities could be best used in a variety of careers',
      type: 'multiple-choice'
    },

  ],
  answers: createAnswersArray(2),
};

export const ONBOARDING_CIDI_CAREER_COMMITMENT_QUALITY_SURVEY: OnboardingSurvey = {
  questions: [
    {
      index: 0,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'My career of interest is one of the most important aspects of my life',
      type: 'multiple-choice'
    },
    {
      index: 1,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'Can say that I have found my purpose in life through my career of interest',
      type: 'multiple-choice'
    },
    {
      index: 2,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'My career of interest gives meaning to my life',
      type: 'multiple-choice'
    },
    {
      index: 3,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'My career plans match my true interests and values',
      type: 'multiple-choice'
    },
  ],
  answers: createAnswersArray(4),
};
