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
} = surveyStoreFactory(CIDI_CAREER_EXPLORATION_BREADTH_SELF_SURVEY,'journai-pre-cidi-career-exploration-breadth-self.store-storage')


export const useCidiPreCareerExplorationBreadthSelfSurveyStore = useSurveyStore;
export const useCidiPreCareerExplorationBreadthSelfSurveyActions = useSurveyActions;
export const useCidiPreCareerExplorationBreadthSelfIsFinalQuestion = useIsFinalQuestion;
export const useCidiPreCareerExplorationBreadthSelfCurrentQuestion = useCurrentQuestion;
export const useCidiPreCareerExplorationBreadthSelfAnswers = useAnswers;
export const useCidiPreCareerExplorationBreadthSelfCurrentAnswer = useCurrentAnswer;
export const useCidiPreCareerExplorationBreadthSelfCurrentProgress = useCurrentProgress;
export const useCidiPreCareerExplorationBreadthSelfCanMoveToNextQuestion = useCanMoveToNextQuestion;
export const useCidiPreCareerExplorationBreadthSelfQuestionCount = () => useSurveyStore().survey.questions.length;
