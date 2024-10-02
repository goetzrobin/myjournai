import { CIDI_CAREER_COMMITMENT_QUALITY_SURVEY, surveyStoreFactory } from '~myjournai/survey';

const {
  useSurveyStore,
  useSurveyActions,
  useIsFinalQuestion,
  useCurrentQuestion,
  useAnswers,
  useCurrentAnswer,
  useCurrentProgress,
  useCanMoveToNextQuestion
} = surveyStoreFactory(CIDI_CAREER_COMMITMENT_QUALITY_SURVEY, 'journai-pre-cidi-career-commitment-quality.store-storage');


export const useCidiPreCareerCommitmentQualitySurveyStore = useSurveyStore;
export const useCidiPreCareerCommitmentQualitySurveyActions = useSurveyActions;
export const useCidiPreCareerCommitmentQualityIsFinalQuestion = useIsFinalQuestion;
export const useCidiPreCareerCommitmentQualityCurrentQuestion = useCurrentQuestion;
export const useCidiPreCareerCommitmentQualityAnswers = useAnswers;
export const useCidiPreCareerCommitmentQualityCurrentAnswer = useCurrentAnswer;
export const useCidiPreCareerCommitmentQualityCurrentProgress = useCurrentProgress;
export const useCidiPreCareerCommitmentQualityCanMoveToNextQuestion = useCanMoveToNextQuestion;
export const useCidiPreCareerCommitmentQualityQuestionCount = () => useSurveyStore().survey.questions.length;
