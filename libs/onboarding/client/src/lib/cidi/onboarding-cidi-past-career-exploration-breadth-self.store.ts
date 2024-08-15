import { onboardingSurveyStoreFactory } from '../onboarding-store-factory';
import { ONBOARDING_CIDI_PAST_CAREER_EXPLORATION_BREADTH_SELF_SURVEY } from './onboarding-cidi.data';

const {
  useOnboardingSurveyStore,
  useOnboardingSurveyActions,
  useOnboardingIsFinalQuestion,
  useOnboardingCurrentQuestion,
  useOnboardingAnswers,
  useOnboardingCurrentAnswer,
  useOnboardingCurrentProgress,
  useOnboardingCanMoveToNextQuestion,
} = onboardingSurveyStoreFactory(ONBOARDING_CIDI_PAST_CAREER_EXPLORATION_BREADTH_SELF_SURVEY,'journai-onboarding-cidi-past-career-exploration-breadth-self.store-storage')


export const useOnbCidiPastCareerExplorationBreadthSelfSurveyStore = useOnboardingSurveyStore;
export const useOnbCidiPastCareerExplorationBreadthSelfSurveyActions = useOnboardingSurveyActions;
export const useOnbCidiPastCareerExplorationBreadthSelfIsFinalQuestion = useOnboardingIsFinalQuestion;
export const useOnbCidiPastCareerExplorationBreadthSelfCurrentQuestion = useOnboardingCurrentQuestion;
export const useOnbCidiPastCareerExplorationBreadthSelfAnswers = useOnboardingAnswers;
export const useOnbCidiPastCareerExplorationBreadthSelfCurrentAnswer = useOnboardingCurrentAnswer;
export const useOnbCidiPastCareerExplorationBreadthSelfCurrentProgress = useOnboardingCurrentProgress;
export const useOnbCidiPastCareerExplorationBreadthSelfCanMoveToNextQuestion = useOnboardingCanMoveToNextQuestion;
export const useOnbCidiPastCareerExplorationBreadthSelfQuestionCount = () => useOnboardingSurveyStore().survey.questions.length;
