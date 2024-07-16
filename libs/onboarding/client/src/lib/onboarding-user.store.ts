import { ONBOARDING_USER_SURVEY } from './onboarding-user.data';
import { onboardingSurveyStoreFactory } from './onboarding-store-factory';

export const {
  useOnboardingSurveyStore,
  useOnboardingSurveyActions,
  useOnboardingIsFinalQuestion,
  useOnboardingCurrentQuestion,
  useOnboardingAnswers,
  useOnboardingCurrentAnswer,
  useOnboardingCurrentProgress,
  useOnboardingCanMoveToNextQuestion,
} = onboardingSurveyStoreFactory(ONBOARDING_USER_SURVEY,'onboarding-survey-storage')
