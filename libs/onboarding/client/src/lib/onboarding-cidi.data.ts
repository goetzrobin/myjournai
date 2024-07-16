import { OnboardingPossibleAnswer, OnboardingSurvey } from './onboarding-survey';

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

export const ONBOARDING_CIDI_SURVEY: OnboardingSurvey = {
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
  answers: [
    {
      value: 3,
      type: 'fixed'
    },
    {
      value: 3,
      type: 'fixed'
    },
    {
      value: 3,
      type: 'fixed'
    },
    {
      value: 3,
      type: 'fixed'
    },
    {
      value: 3,
      type: 'fixed'
    },
    {
      value: 3,
      type: 'fixed'
    },
    {
      value: 3,
      type: 'fixed'
    },
    {
      value: 3,
      type: 'fixed'
    }
  ]
};
