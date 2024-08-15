import { onboardingSurveyStoreFactory } from '../onboarding-store-factory';
import { ONBOARDING_CIDI_CAREER_IDENTITY_CONFUSION_SURVEY } from './onboarding-cidi.data';

const {
  useOnboardingSurveyStore,
  useOnboardingSurveyActions,
  useOnboardingIsFinalQuestion,
  useOnboardingCurrentQuestion,
  useOnboardingAnswers,
  useOnboardingCurrentAnswer,
  useOnboardingCurrentProgress,
  useOnboardingCanMoveToNextQuestion,
} = onboardingSurveyStoreFactory(ONBOARDING_CIDI_CAREER_IDENTITY_CONFUSION_SURVEY,'journai-onbcidi-career-identity-confusion-survey-storage')


export const useOnbCidiCareerIdentityConfusionSurveyStore = useOnboardingSurveyStore;
export const useOnbCidiCareerIdentityConfusionSurveyActions = useOnboardingSurveyActions;
export const useOnbCidiCareerIdentityConfusionIsFinalQuestion = useOnboardingIsFinalQuestion;
export const useOnbCidiCareerIdentityConfusionCurrentQuestion = useOnboardingCurrentQuestion;
export const useOnbCidiCareerIdentityConfusionAnswers = useOnboardingAnswers;
export const useOnbCidiCareerIdentityConfusionCurrentAnswer = useOnboardingCurrentAnswer;
export const useOnbCidiCareerIdentityConfusionCurrentProgress = useOnboardingCurrentProgress;
export const useOnbCidiCareerIdentityConfusionCanMoveToNextQuestion = useOnboardingCanMoveToNextQuestion;
export const useOnbCidiCareerIdentityConfusionQuestionCount = () => useOnboardingSurveyStore().survey.questions.length;
