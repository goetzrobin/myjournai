// Please select which group you belong:
//   Current student-athlete, current Temple STHM undergraduate student, current Temple MSSB student (former student-athlete), former student-athlete (non-MSSB student)

import { Survey, SurveyQuestion } from '~myjournai/survey';

const GROUP_QUESTION: SurveyQuestion = {
  index: 0,
  possibleAnswers: [
    {
      type: 'fixed',
      value: 'current-athlete',
      label: 'Current student-athlete'
    },
    {
      type: 'fixed',
      value: 'current-sthm',
      label: 'Current Temple STHM undergraduate student'
    },
    {
      type: 'fixed',
      value: 'former-athlete-current-mssb',
      label: 'Current Temple MSSB student'
    },
    {
      type: 'fixed',
      value: 'former-athlete-non-mssb',
      label: 'Former student-athlete (non-MSSB student)'
    },
    {
      type: 'custom',
      value: 'other',
      label: 'Other'
    }
  ],
  question: 'Please select which group you belong:',
  type: 'multiple-choice'
};
// What is your gender identity?
//   Man, woman, transgender man, transgender woman, non-binary, prefer to self describe (with text box), prefer not to say
const GENDER_IDENTITY_QUESTION: SurveyQuestion = {
  index: 1,
  possibleAnswers: [
    {
      type: 'fixed',
      value: 'woman',
      label: 'Woman'
    },
    {
      type: 'fixed',
      value: 'man',
      label: 'Man'
    },
    {
      type: 'fixed',
      value: 'transgender man',
      label: 'Transgender man'
    },
    {
      type: 'fixed',
      value: 'transgender woman',
      label: 'Transgender woman'
    },
    {
      type: 'fixed',
      value: 'non-binary',
      label: 'Non Binary'
    },
    {
      type: 'custom',
      value: 'prefer-to-self-describe',
      label: 'Prefer to self describe'
    },
    {
      type: 'fixed',
      value: 'prefer-not-to-say',
      label: 'Prefer not to say'
    }
  ],
  question: 'What is your gender identity?',
  type: 'multiple-choice'
};
// What is your race/ethnicity?
//   American Indian or Alaska Native, Asian, Black or African American, Hispanic/Latino/Latina, White/Caucasian, Native Hawaiian or other Pacific Islander, Biracial or Multiracial (with textbox), prefer to self describe (with text box), prefer not to say
const ETHNICITY_QUESTION: SurveyQuestion = {
  index: 2,
  possibleAnswers: [
    {
      type: 'fixed',
      value: 'american-indian-or-alaska-native',
      label: 'American Indian or Alaska Native'
    },
    {
      type: 'fixed',
      value: 'asian',
      label: 'Asian'
    },
    {
      type: 'fixed',
      value: 'black-or-african-american',
      label: 'Black or African American'
    },
    {
      type: 'fixed',
      value: 'hispanic/latino/latina',
      label: 'Hispanic/Latino/Latina'
    },
    {
      type: 'fixed',
      value: 'white/caucasian',
      label: 'White/Caucasian'
    },
    {
      type: 'fixed',
      value: 'native-hawaiian-or-other-pacific-islander',
      label: 'Native Hawaiian or other Pacific Islander'
    },
    {
      type: 'custom',
      value: 'biracial-or-multiracial',
      label: 'Biracial or Multiracial'
    },
    {
      type: 'custom',
      value: 'prefer-to-self-describe',
      label: 'Prefer to self describe'
    },
    {
      type: 'fixed',
      value: 'prefer-not-to-say',
      label: 'Prefer not to say'
    }
  ],
  question: 'What is your race/ethnicity?',
  type: 'multiple-choice'
};
const COMPETITION_LEVEL_QUESTION: SurveyQuestion = {
  index: 3,
  possibleAnswers: [
    {
      type: 'fixed',
      value: 'youth-rec',
      label: 'Youth/Recreational Sport'
    },
    {
      type: 'fixed',
      value: 'high-school',
      label: 'High School Sport'
    },
    {
      type: 'fixed',
      value: 'college',
      label: 'College Sport'
    }
  ],
  question: 'What is the highest level of sport competition you participate(d) in?',
  type: 'multiple-choice'
};
// If you are/were a student-athlete, what division did you participate in?
//   NCAA Division I, NCAA Division II, NCAA Division III, other (with text box)
const DIVISION_QUESTION: SurveyQuestion = {
  index: 3,
  possibleAnswers: [
    {
      type: 'fixed',
      value: 'D1',
      label: 'NCAA Division I'
    },
    {
      type: 'fixed',
      value: 'D2',
      label: 'NCAA Division II'
    },
    {
      type: 'fixed',
      value: 'D3',
      label: 'NCAA Division III'
    },
    {
      type: 'custom',
      value: 'other',
      label: 'Other'
    },
  ],
  question: 'If you are/were a student-athlete, what division did you participate in?',
  type: 'multiple-choice'
};
// What is your expected or actual graduation year?  (text box entry)
const GRAD_YEAR_QUESTION: SurveyQuestion = {
  index: 4,
  possibleAnswers: [{
    type: 'custom',
    value: 'graduation-year',
    label: 'Graduation Year'
  }],
  question: ' What is your expected or actual graduation year?',
  type: 'number'
};

export const ONBOARDING_USER_SURVEY: Survey = {
  questions: [GROUP_QUESTION, GENDER_IDENTITY_QUESTION, ETHNICITY_QUESTION, COMPETITION_LEVEL_QUESTION, DIVISION_QUESTION, GRAD_YEAR_QUESTION],
  answers: [undefined, undefined, undefined, undefined, { value: 2025, type: 'custom', customValue: 2025 }]
};

export const COMPETITION_LEVEL_QUESTION_RAW = COMPETITION_LEVEL_QUESTION.question
