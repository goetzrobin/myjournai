import { onboardingSurveyStoreFactory } from '../onboarding-store-factory';
import { ONBOARDING_CIDI_CAREER_EXPLORATION_BREADTH_SELF_SURVEY } from './onboarding-cidi.data';

const {
  useOnboardingSurveyStore,
  useOnboardingSurveyActions,
  useOnboardingIsFinalQuestion,
  useOnboardingCurrentQuestion,
  useOnboardingAnswers,
  useOnboardingCurrentAnswer,
  useOnboardingCurrentProgress,
  useOnboardingCanMoveToNextQuestion,
} = onboardingSurveyStoreFactory(ONBOARDING_CIDI_CAREER_EXPLORATION_BREADTH_SELF_SURVEY,'journai-onboarding-cidi-career-exploration-breadth-self.store-storage')


export const useOnbCidiCareerExplorationBreadthSelfSurveyStore = useOnboardingSurveyStore;
export const useOnbCidiCareerExplorationBreadthSelfSurveyActions = useOnboardingSurveyActions;
export const useOnbCidiCareerExplorationBreadthSelfIsFinalQuestion = useOnboardingIsFinalQuestion;
export const useOnbCidiCareerExplorationBreadthSelfCurrentQuestion = useOnboardingCurrentQuestion;
export const useOnbCidiCareerExplorationBreadthSelfAnswers = useOnboardingAnswers;
export const useOnbCidiCareerExplorationBreadthSelfCurrentAnswer = useOnboardingCurrentAnswer;
export const useOnbCidiCareerExplorationBreadthSelfCurrentProgress = useOnboardingCurrentProgress;
export const useOnbCidiCareerExplorationBreadthSelfCanMoveToNextQuestion = useOnboardingCanMoveToNextQuestion;
export const useOnbCidiCareerExplorationBreadthSelfQuestionCount = () => useOnboardingSurveyStore().survey.questions.length;
