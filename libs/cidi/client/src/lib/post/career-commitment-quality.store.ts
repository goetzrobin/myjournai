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
} = surveyStoreFactory(CIDI_CAREER_COMMITMENT_QUALITY_SURVEY, 'journai-post-cidi-career-commitment-quality.store-storage');


export const useCidiPostCareerCommitmentQualitySurveyStore = useSurveyStore;
export const useCidiPostCareerCommitmentQualitySurveyActions = useSurveyActions;
export const useCidiPostCareerCommitmentQualityIsFinalQuestion = useIsFinalQuestion;
export const useCidiPostCareerCommitmentQualityCurrentQuestion = useCurrentQuestion;
export const useCidiPostCareerCommitmentQualityAnswers = useAnswers;
export const useCidiPostCareerCommitmentQualityCurrentAnswer = useCurrentAnswer;
export const useCidiPostCareerCommitmentQualityCurrentProgress = useCurrentProgress;
export const useCidiPostCareerCommitmentQualityCanMoveToNextQuestion = useCanMoveToNextQuestion;
export const useCidiPostCareerCommitmentQualityQuestionCount = () => useSurveyStore().survey.questions.length;
