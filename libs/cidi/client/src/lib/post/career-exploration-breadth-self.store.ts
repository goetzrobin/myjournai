import { CIDI_CAREER_EXPLORATION_BREADTH_SELF_SURVEY, surveyStoreFactory } from '~myjournai/survey';

const {
  useSurveyStore,
  useSurveyActions,
  useIsFinalQuestion,
  useCurrentQuestion,
  useAnswers,
  useCurrentAnswer,
  useCurrentProgress,
  useCanMoveToNextQuestion,
} = surveyStoreFactory(CIDI_CAREER_EXPLORATION_BREADTH_SELF_SURVEY,'journai-post-cidi-career-exploration-breadth-self.store-storage')


export const useCidiPostCareerExplorationBreadthSelfSurveyStore = useSurveyStore;
export const useCidiPostCareerExplorationBreadthSelfSurveyActions = useSurveyActions;
export const useCidiPostCareerExplorationBreadthSelfIsFinalQuestion = useIsFinalQuestion;
export const useCidiPostCareerExplorationBreadthSelfCurrentQuestion = useCurrentQuestion;
export const useCidiPostCareerExplorationBreadthSelfAnswers = useAnswers;
export const useCidiPostCareerExplorationBreadthSelfCurrentAnswer = useCurrentAnswer;
export const useCidiPostCareerExplorationBreadthSelfCurrentProgress = useCurrentProgress;
export const useCidiPostCareerExplorationBreadthSelfCanMoveToNextQuestion = useCanMoveToNextQuestion;
export const useCidiPostCareerExplorationBreadthSelfQuestionCount = () => useSurveyStore().survey.questions.length;
