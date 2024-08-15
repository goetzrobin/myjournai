import { onboardingSurveyStoreFactory } from '../onboarding-store-factory';
import { ONBOARDING_CIDI_CAREER_COMMITMENT_QUALITY_SURVEY } from './onboarding-cidi.data';

const {
  useOnboardingSurveyStore,
  useOnboardingSurveyActions,
  useOnboardingIsFinalQuestion,
  useOnboardingCurrentQuestion,
  useOnboardingAnswers,
  useOnboardingCurrentAnswer,
  useOnboardingCurrentProgress,
  useOnboardingCanMoveToNextQuestion,
} = onboardingSurveyStoreFactory(ONBOARDING_CIDI_CAREER_COMMITMENT_QUALITY_SURVEY,'journai-onboarding-cidi-career-commitment-quality.store-storage')


export const useOnbCidiCareerCommitmentQualitySurveyStore = useOnboardingSurveyStore;
export const useOnbCidiCareerCommitmentQualitySurveyActions = useOnboardingSurveyActions;
export const useOnbCidiCareerCommitmentQualityIsFinalQuestion = useOnboardingIsFinalQuestion;
export const useOnbCidiCareerCommitmentQualityCurrentQuestion = useOnboardingCurrentQuestion;
export const useOnbCidiCareerCommitmentQualityAnswers = useOnboardingAnswers;
export const useOnbCidiCareerCommitmentQualityCurrentAnswer = useOnboardingCurrentAnswer;
export const useOnbCidiCareerCommitmentQualityCurrentProgress = useOnboardingCurrentProgress;
export const useOnbCidiCareerCommitmentQualityCanMoveToNextQuestion = useOnboardingCanMoveToNextQuestion;
export const useOnbCidiCareerCommitmentQualityQuestionCount = () => useOnboardingSurveyStore().survey.questions.length;
