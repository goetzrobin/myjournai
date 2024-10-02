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
} = surveyStoreFactory(CIDI_PAST_CAREER_EXPLORATION_BREADTH_SELF_SURVEY,'journai-pre-cidi-past-career-exploration-breadth-self.store-storage')


export const useCidiPrePastCareerExplorationBreadthSelfSurveyStore = useSurveyStore;
export const useCidiPrePastCareerExplorationBreadthSelfSurveyActions = useSurveyActions;
export const useCidiPrePastCareerExplorationBreadthSelfIsFinalQuestion = useIsFinalQuestion;
export const useCidiPrePastCareerExplorationBreadthSelfCurrentQuestion = useCurrentQuestion;
export const useCidiPrePastCareerExplorationBreadthSelfAnswers = useAnswers;
export const useCidiPrePastCareerExplorationBreadthSelfCurrentAnswer = useCurrentAnswer;
export const useCidiPrePastCareerExplorationBreadthSelfCurrentProgress = useCurrentProgress;
export const useCidiPrePastCareerExplorationBreadthSelfCanMoveToNextQuestion = useCanMoveToNextQuestion;
export const useCidiPrePastCareerExplorationBreadthSelfQuestionCount = () => useSurveyStore().survey.questions.length;
