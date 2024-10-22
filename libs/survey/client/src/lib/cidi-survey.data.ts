import { Survey, SurveyActualAnswer, SurveyPossibleAnswer } from './survey';

const createAnswersArray = (size: number) => {
  const a: (SurveyActualAnswer | undefined)[] = [];
  let total = size;
  while (total--) a.push({
    value: 3,
    type: 'fixed'
  });
  return a;
};
const LIKERT_ANSWERS: SurveyPossibleAnswer[] = [
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

export const CIDI_CAREER_IDENTITY_CONFUSION_SURVEY: Survey = {
  questions: [
    {
      index: 0,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'I feel confused as to who I really am when it comes to my career path',
      type: 'multiple-choice',
      direction: 'smaller-better'
    },
    {
      index: 1,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'I am uncertain about the kind of work I could perform well',
      type: 'multiple-choice',
      direction: 'smaller-better'
    },
    {
      index: 2,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'Deciding on a career makes me feel anxious',
      type: 'multiple-choice',
      direction: 'smaller-better'
    },
    {
      index: 3,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'I often feel lost when I think about choosing a career because I don’t have enough information and/or experience to make a career decision at this point',
      type: 'multiple-choice',
      direction: 'smaller-better'
    },
    {
      index: 4,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'Trying to find a satisfying career is stressful because there are so many things to consider',
      type: 'multiple-choice',
      direction: 'smaller-better'
    },
    {
      index: 5,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'Being unsure about what kind of career I would enjoy worries me',
      type: 'multiple-choice',
      direction: 'smaller-better'
    },
    {
      index: 6,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'I have doubts that I will be able to find a career that I’m satisfied with',
      type: 'multiple-choice',
      direction: 'smaller-better'
    },
    {
      index: 7,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'I have no clear sense of a career direction that would be meaningful to me',
      type: 'multiple-choice',
      direction: 'smaller-better'
    }
  ],
  answers: createAnswersArray(8),
};

export const CIDI_CAREER_EXPLORATION_BREADTH_SELF_SURVEY: Survey = {
  questions: [
    {
      index: 0,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'I like to learn about myself for the purpose of finding a career that meets my needs',
      type: 'multiple-choice',
      direction: 'bigger-better'
    },
    {
      index: 1,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'I reflect on how my past could integrate with various career alternatives',
      type: 'multiple-choice',
      direction: 'bigger-better'
    },
    {
      index: 2,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'I think about which career options would be a good fit with my personality and values',
      type: 'multiple-choice',
      direction: 'bigger-better'
    },
    {
      index: 3,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'I reflect on how my strengths and abilities could be best used in a variety of careers',
      type: 'multiple-choice',
      direction: 'bigger-better'
    },
  ],
  answers: createAnswersArray(4),
};

export const CIDI_CAREER_EXPLORATION_DEPTH_SELF_SURVEY: Survey = {
  questions: [
    {
      index: 0,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'I reflect on how my chosen career path aligns with my past experiences',
      type: 'multiple-choice',
      direction: 'bigger-better'
    },
    {
      index: 1,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'I contemplate what I value most in my desired career',
      type: 'multiple-choice',
      direction: 'bigger-better'
    },
    {
      index: 2,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'I contemplate how the work I want to do is congruent with my interests and personality',
      type: 'multiple-choice',
      direction: 'bigger-better'
    },
    {
      index: 3,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'I reflect on how my strengths and abilities could be best used in my desired career',
      type: 'multiple-choice',
      direction: 'bigger-better'
    },
  ],
  answers: createAnswersArray(4),
};

export const CIDI_PAST_CAREER_EXPLORATION_BREADTH_SELF_SURVEY: Survey = {
  questions: [
    {
      index: 0,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'I thought about which career options would be a good fit with my personality and values',
      type: 'multiple-choice',
      direction: 'bigger-better'
    },
    {
      index: 1,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'I reflected on how my strengths and abilities could be best used in a variety of careers',
      type: 'multiple-choice',
      direction: 'bigger-better'
    },

  ],
  answers: createAnswersArray(2),
};

export const CIDI_CAREER_COMMITMENT_QUALITY_SURVEY: Survey = {
  questions: [
    {
      index: 0,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'My career of interest is one of the most important aspects of my life',
      type: 'multiple-choice',
      direction: 'bigger-better'
    },
    {
      index: 1,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'I can say that I have found my purpose in life through my career of interest',
      type: 'multiple-choice',
      direction: 'bigger-better'
    },
    {
      index: 2,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'My career of interest gives meaning to my life',
      type: 'multiple-choice',
      direction: 'bigger-better'
    },
    {
      index: 3,
      possibleAnswers: LIKERT_ANSWERS,
      question: 'My career plans match my true interests and values',
      type: 'multiple-choice',
      direction: 'bigger-better'
    },
  ],
  answers: createAnswersArray(4),
};
