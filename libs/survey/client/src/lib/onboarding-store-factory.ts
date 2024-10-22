import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Survey, SurveyActualAnswer, SurveyPossibleAnswer } from './survey';

export const surveyStoreFactory = (survey: Survey, storageKey: string) => {
  const useSurveyStore = create(
    persist<{
      survey: Survey;
      currentIndex: number;
      actions: {
        reset: () => void;
        moveToPreviousQuestion: () => void;
        moveToNextQuestion: () => void;
        answerCurrentQuestion: (selectedAnswer: SurveyPossibleAnswer, customValue?: string | number) => void;
      };
    }>(
      (set, get) => ({
        survey,
        currentIndex: 0,
        actions: {
          reset: () => set({ survey, currentIndex: 0 }),
          moveToPreviousQuestion: () => {
            const { currentIndex } = get();
            // skip division question if current question is determined as non athlete
            if (survey.answers?.[currentIndex - 2]?.value !== 'college' && survey.questions[currentIndex - 2].question === 'What is the highest level of sport competition you participate(d) in?') {
              set({ currentIndex: Math.max(currentIndex - 2, 0) });
            } else {
              set({ currentIndex: Math.max(currentIndex - 1, 0) });
            }
          },
          moveToNextQuestion: () => {
            const { currentIndex, survey } = get();
            // skip division question if current question is determined as non athlete
            if (survey.answers?.[currentIndex]?.value !== 'college' && survey.questions[currentIndex].question === 'What is the highest level of sport competition you participate(d) in?') {
              const newAnswers = [...survey.answers];
              newAnswers[currentIndex + 1] = { type: 'fixed', value: 'none' };
              set({ currentIndex: Math.min(currentIndex + 2, survey.questions.length - 1), survey: { ...survey, answers: newAnswers } });

            } else {
              set({ currentIndex: Math.min(currentIndex + 1, survey.questions.length - 1) });
            }
          },
          answerCurrentQuestion: (selectedAnswer: SurveyPossibleAnswer, customValue?: string | number) => {
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
  const useSurveyActions = () => useSurveyStore((s) => s.actions);
  const useIsFinalQuestion = () => useSurveyStore((s) => s.survey.questions.length - 1 === s.currentIndex);
  const useCurrentQuestion = () => useSurveyStore((s) => s.survey.questions[s.currentIndex]);
  const useAnswers = () => useSurveyStore((s) => s.survey.answers);
  const useCurrentAnswer = () => useSurveyStore((s) => s.survey.answers[s.currentIndex] as SurveyActualAnswer | undefined);
  const useCurrentProgress = () => useSurveyStore((s) => Math.round(((s.currentIndex + 1) / s.survey.questions.length) * 100));
  const useCanMoveToNextQuestion = () => useSurveyStore((s) => {
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
    useSurveyStore,
    useSurveyActions,
    useIsFinalQuestion,
    useCurrentQuestion,
    useAnswers,
    useCurrentAnswer,
    useCurrentProgress,
    useCanMoveToNextQuestion
  };
};
