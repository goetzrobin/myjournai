export type SurveyPossibleAnswer = {
  label: string;
  value: string | number;
  type: 'fixed' | 'custom'
}

export type SurveyActualAnswer = {
  type: 'fixed' | 'custom';
  value: string | number;
  customValue?: string | number;
}

export type SurveyQuestion = {
  question: string;
  type: 'multiple-choice' | 'number';
  index: number;
  direction: 'bigger-better' | 'smaller-better'
  possibleAnswers: SurveyPossibleAnswer[];
}

export type Survey = {
  questions: SurveyQuestion[];
  answers: (SurveyActualAnswer | undefined)[];
}
