import { CIDI_CAREER_IDENTITY_CONFUSION_SURVEY, surveyStoreFactory } from '~myjournai/survey';

const {
  useSurveyStore,
  useSurveyActions,
  useIsFinalQuestion,
  useCurrentQuestion,
  useAnswers,
  useCurrentAnswer,
  useCurrentProgress,
  useCanMoveToNextQuestion,
} = surveyStoreFactory(CIDI_CAREER_IDENTITY_CONFUSION_SURVEY,'journai-post-cidi-career-identity-confusion-survey-storage')


export const useCidiPostCareerIdentityConfusionSurveyStore = useSurveyStore;
export const useCidiPostCareerIdentityConfusionSurveyActions = useSurveyActions;
export const useCidiPostCareerIdentityConfusionIsFinalQuestion = useIsFinalQuestion;
export const useCidiPostCareerIdentityConfusionCurrentQuestion = useCurrentQuestion;
export const useCidiPostCareerIdentityConfusionAnswers = useAnswers;
export const useCidiPostCareerIdentityConfusionCurrentAnswer = useCurrentAnswer;
export const useCidiPostCareerIdentityConfusionCurrentProgress = useCurrentProgress;
export const useCidiPostCareerIdentityConfusionCanMoveToNextQuestion = useCanMoveToNextQuestion;
export const useCidiPostCareerIdentityConfusionQuestionCount = () => useSurveyStore().survey.questions.length;
