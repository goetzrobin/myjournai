import { CIDI_CAREER_EXPLORATION_DEPTH_SELF_SURVEY, surveyStoreFactory } from '~myjournai/survey';

const {
  useSurveyStore,
  useSurveyActions,
  useIsFinalQuestion,
  useCurrentQuestion,
  useAnswers,
  useCurrentAnswer,
  useCurrentProgress,
  useCanMoveToNextQuestion,
} = surveyStoreFactory(CIDI_CAREER_EXPLORATION_DEPTH_SELF_SURVEY,'journai-pre-cidi-career-exploration-depth-self.store-storage')


export const useCidiPreCareerExplorationDepthSelfSurveyStore = useSurveyStore;
export const useCidiPreCareerExplorationDepthSelfSurveyActions = useSurveyActions;
export const useCidiPreCareerExplorationDepthSelfIsFinalQuestion = useIsFinalQuestion;
export const useCidiPreCareerExplorationDepthSelfCurrentQuestion = useCurrentQuestion;
export const useCidiPreCareerExplorationDepthSelfAnswers = useAnswers;
export const useCidiPreCareerExplorationDepthSelfCurrentAnswer = useCurrentAnswer;
export const useCidiPreCareerExplorationDepthSelfCurrentProgress = useCurrentProgress;
export const useCidiPreCareerExplorationDepthSelfCanMoveToNextQuestion = useCanMoveToNextQuestion;
export const useCidiPreCareerExplorationDepthSelfQuestionCount = () => useSurveyStore().survey.questions.length;
