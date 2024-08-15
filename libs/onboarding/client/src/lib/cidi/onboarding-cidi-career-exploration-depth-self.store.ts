import { onboardingSurveyStoreFactory } from '../onboarding-store-factory';
import { ONBOARDING_CIDI_CAREER_EXPLORATION_DEPTH_SELF_SURVEY } from './onboarding-cidi.data';

const {
  useOnboardingSurveyStore,
  useOnboardingSurveyActions,
  useOnboardingIsFinalQuestion,
  useOnboardingCurrentQuestion,
  useOnboardingAnswers,
  useOnboardingCurrentAnswer,
  useOnboardingCurrentProgress,
  useOnboardingCanMoveToNextQuestion,
} = onboardingSurveyStoreFactory(ONBOARDING_CIDI_CAREER_EXPLORATION_DEPTH_SELF_SURVEY,'journai-onboarding-cidi-career-exploration-depth-self.store-storage')


export const useOnbCidiCareerExplorationDepthSelfSurveyStore = useOnboardingSurveyStore;
export const useOnbCidiCareerExplorationDepthSelfSurveyActions = useOnboardingSurveyActions;
export const useOnbCidiCareerExplorationDepthSelfIsFinalQuestion = useOnboardingIsFinalQuestion;
export const useOnbCidiCareerExplorationDepthSelfCurrentQuestion = useOnboardingCurrentQuestion;
export const useOnbCidiCareerExplorationDepthSelfAnswers = useOnboardingAnswers;
export const useOnbCidiCareerExplorationDepthSelfCurrentAnswer = useOnboardingCurrentAnswer;
export const useOnbCidiCareerExplorationDepthSelfCurrentProgress = useOnboardingCurrentProgress;
export const useOnbCidiCareerExplorationDepthSelfCanMoveToNextQuestion = useOnboardingCanMoveToNextQuestion;
export const useOnbCidiCareerExplorationDepthSelfQuestionCount = () => useOnboardingSurveyStore().survey.questions.length;
