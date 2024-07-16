export type OnboardingPossibleAnswer = {
  label: string;
  value: string | number;
  type: 'fixed' | 'custom'
}

export type OnboardingActualAnswer = {
  type: 'fixed' | 'custom';
  value: string | number;
  customValue?: string | number;
}

export type OnboardingQuestion = {
  question: string;
  type: 'multiple-choice' | 'number';
  index: number;
  possibleAnswers: OnboardingPossibleAnswer[];
}

export type OnboardingSurvey = {
  questions: OnboardingQuestion[];
  answers: OnboardingActualAnswer[];
}
