import { ONBOARDING_USER_SURVEY } from './onboarding-user.data';
import { surveyStoreFactory } from '~myjournai/survey';

export const {
  useSurveyStore: useOnboardingSurveyStore,
  useSurveyActions: useOnboardingSurveyActions,
  useIsFinalQuestion: useOnboardingIsFinalQuestion,
  useCurrentQuestion: useOnboardingCurrentQuestion,
  useAnswers: useOnboardingAnswers,
  useCurrentAnswer: useOnboardingCurrentAnswer,
  useCurrentProgress: useOnboardingCurrentProgress,
  useCanMoveToNextQuestion: useOnboardingCanMoveToNextQuestion,
} = surveyStoreFactory(ONBOARDING_USER_SURVEY,'onboarding-survey-storage')
