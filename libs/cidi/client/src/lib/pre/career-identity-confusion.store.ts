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
} = surveyStoreFactory(CIDI_CAREER_IDENTITY_CONFUSION_SURVEY,'journai-pre-career-identity-confusion-survey-storage')


export const useCidiPreCareerIdentityConfusionSurveyStore = useSurveyStore;
export const useCidiPreCareerIdentityConfusionSurveyActions = useSurveyActions;
export const useCidiPreCareerIdentityConfusionIsFinalQuestion = useIsFinalQuestion;
export const useCidiPreCareerIdentityConfusionCurrentQuestion = useCurrentQuestion;
export const useCidiPreCareerIdentityConfusionAnswers = useAnswers;
export const useCidiPreCareerIdentityConfusionCurrentAnswer = useCurrentAnswer;
export const useCidiPreCareerIdentityConfusionCurrentProgress = useCurrentProgress;
export const useCidiPreCareerIdentityConfusionCanMoveToNextQuestion = useCanMoveToNextQuestion;
export const useCidiPreCareerIdentityConfusionQuestionCount = () => useSurveyStore().survey.questions.length;
