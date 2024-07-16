import { onboardingSurveyStoreFactory } from './onboarding-store-factory';
import { ONBOARDING_CIDI_SURVEY } from './onboarding-cidi.data';

const {
  useOnboardingSurveyStore,
  useOnboardingSurveyActions,
  useOnboardingIsFinalQuestion,
  useOnboardingCurrentQuestion,
  useOnboardingAnswers,
  useOnboardingCurrentAnswer,
  useOnboardingCurrentProgress,
  useOnboardingCanMoveToNextQuestion,
} = onboardingSurveyStoreFactory(ONBOARDING_CIDI_SURVEY,'onboarding-cidi-survey-storage')


export const useOnbCidiSurveyStore = useOnboardingSurveyStore;
export const useOnbCidiSurveyActions = useOnboardingSurveyActions;
export const useOnbCidiIsFinalQuestion = useOnboardingIsFinalQuestion;
export const useOnbCidiCurrentQuestion = useOnboardingCurrentQuestion;
export const useOnbCidiAnswers = useOnboardingAnswers;
export const useOnbCidiCurrentAnswer = useOnboardingCurrentAnswer;
export const useOnbCidiCurrentProgress = useOnboardingCurrentProgress;
export const useOnbCidiCanMoveToNextQuestion = useOnboardingCanMoveToNextQuestion;
export const useOnbCidiQuestionCount = () => useOnboardingSurveyStore().survey.questions.length;
