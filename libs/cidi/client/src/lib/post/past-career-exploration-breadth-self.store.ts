import { CIDI_PAST_CAREER_EXPLORATION_BREADTH_SELF_SURVEY, surveyStoreFactory } from '~myjournai/survey';

const {
  useSurveyStore,
  useSurveyActions,
  useIsFinalQuestion,
  useCurrentQuestion,
  useAnswers,
  useCurrentAnswer,
  useCurrentProgress,
  useCanMoveToNextQuestion,
} = surveyStoreFactory(CIDI_PAST_CAREER_EXPLORATION_BREADTH_SELF_SURVEY,'journai-post-cidi-past-career-exploration-breadth-self.store-storage')


export const useCidiPostPastCareerExplorationBreadthSelfSurveyStore = useSurveyStore;
export const useCidiPostPastCareerExplorationBreadthSelfSurveyActions = useSurveyActions;
export const useCidiPostPastCareerExplorationBreadthSelfIsFinalQuestion = useIsFinalQuestion;
export const useCidiPostPastCareerExplorationBreadthSelfCurrentQuestion = useCurrentQuestion;
export const useCidiPostPastCareerExplorationBreadthSelfAnswers = useAnswers;
export const useCidiPostPastCareerExplorationBreadthSelfCurrentAnswer = useCurrentAnswer;
export const useCidiPostPastCareerExplorationBreadthSelfCurrentProgress = useCurrentProgress;
export const useCidiPostPastCareerExplorationBreadthSelfCanMoveToNextQuestion = useCanMoveToNextQuestion;
export const useCidiPostPastCareerExplorationBreadthSelfQuestionCount = () => useSurveyStore().survey.questions.length;
