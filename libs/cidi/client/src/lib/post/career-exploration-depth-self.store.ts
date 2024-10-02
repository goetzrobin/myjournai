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
} = surveyStoreFactory(CIDI_CAREER_EXPLORATION_DEPTH_SELF_SURVEY,'journai-post-cidi-career-exploration-depth-self.store-storage')


export const useCidiPostCareerExplorationDepthSelfSurveyStore = useSurveyStore;
export const useCidiPostCareerExplorationDepthSelfSurveyActions = useSurveyActions;
export const useCidiPostCareerExplorationDepthSelfIsFinalQuestion = useIsFinalQuestion;
export const useCidiPostCareerExplorationDepthSelfCurrentQuestion = useCurrentQuestion;
export const useCidiPostCareerExplorationDepthSelfAnswers = useAnswers;
export const useCidiPostCareerExplorationDepthSelfCurrentAnswer = useCurrentAnswer;
export const useCidiPostCareerExplorationDepthSelfCurrentProgress = useCurrentProgress;
export const useCidiPostCareerExplorationDepthSelfCanMoveToNextQuestion = useCanMoveToNextQuestion;
export const useCidiPostCareerExplorationDepthSelfQuestionCount = () => useSurveyStore().survey.questions.length;
