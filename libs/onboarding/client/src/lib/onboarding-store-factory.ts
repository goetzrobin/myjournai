import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OnboardingActualAnswer, OnboardingPossibleAnswer, OnboardingSurvey } from './onboarding-survey';

export const onboardingSurveyStoreFactory = (survey: OnboardingSurvey, storageKey: string) => {
  const useOnboardingSurveyStore = create(
    persist<{
      survey: OnboardingSurvey;
      currentIndex: number;
      actions: {
        reset: () => void;
        moveToPreviousQuestion: () => void;
        moveToNextQuestion: () => void;
        answerCurrentQuestion: (selectedAnswer: OnboardingPossibleAnswer, customValue?: string | number) => void;
      };
    }>(
      (set, get) => ({
        survey,
        currentIndex: 0,
        actions: {
          reset: () => set({survey, currentIndex: 0}),
          moveToPreviousQuestion: () => {
            const { currentIndex } = get();
            set({ currentIndex: Math.max(currentIndex - 1, 0) });
          },
          moveToNextQuestion: () => {
            const { currentIndex, survey } = get();
            set({ currentIndex: Math.min(currentIndex + 1, survey.questions.length - 1) });
          },
          answerCurrentQuestion: (selectedAnswer: OnboardingPossibleAnswer, customValue?: string | number) => {
            const { survey, currentIndex } = get();
            const newAnswers = [...survey.answers];
            newAnswers[currentIndex] = { type: selectedAnswer.type, value: selectedAnswer.value, customValue };
            set({ survey: { ...survey, answers: newAnswers } });
          }
        }
      }),
      {
        name: storageKey,
        partialize: ({ actions, ...rest }: any) => rest
      }
    )
  );
  const useOnboardingSurveyActions = () => useOnboardingSurveyStore((s) => s.actions);
  const useOnboardingIsFinalQuestion = () => useOnboardingSurveyStore((s) => s.survey.questions.length - 1 === s.currentIndex);
  const useOnboardingCurrentQuestion = () => useOnboardingSurveyStore((s) => s.survey.questions[s.currentIndex]);
  const useOnboardingAnswers = () => useOnboardingSurveyStore((s) => s.survey.answers);
  const useOnboardingCurrentAnswer = () => useOnboardingSurveyStore((s) => s.survey.answers[s.currentIndex] as OnboardingActualAnswer | undefined);
  const useOnboardingCurrentProgress = () => useOnboardingSurveyStore((s) => Math.round(((s.currentIndex + 1) / s.survey.questions.length) * 100));
  const useOnboardingCanMoveToNextQuestion = () => useOnboardingSurveyStore((s) => {
    const currentAnswer = s.survey.answers[s.currentIndex];
    if (!currentAnswer) return false;
    if (currentAnswer.type === 'fixed') {
      return currentAnswer.value !== null && currentAnswer.value !== undefined;
    }
    if (currentAnswer.type === 'custom') {
      if (currentAnswer.customValue !== null && currentAnswer.customValue !== undefined) {
        return !(typeof currentAnswer.customValue === 'string' && currentAnswer.customValue.length === 0);
      }
    }
    return false;
  });

  return {
    useOnboardingSurveyStore,
    useOnboardingSurveyActions,
    useOnboardingIsFinalQuestion,
    useOnboardingCurrentQuestion,
    useOnboardingAnswers,
    useOnboardingCurrentAnswer,
    useOnboardingCurrentProgress,
    useOnboardingCanMoveToNextQuestion
  };
};
