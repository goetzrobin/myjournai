import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OnboardingStep = 'start' | 'meet-sam' | 'name' | 'pronouns' | 'bday' | 'survey-intro' | 'one-more-thing';

export const useOnboardingProgressStore = create(
  persist<{
    lastStep: OnboardingStep
    actions: {
      reset: () => void;
      setLastStep: (newStep: OnboardingStep) => void;
    };
  }>(
    (set, get) => ({
      lastStep: 'start',
      actions: {
        reset: () => set({lastStep: 'start'}),
        setLastStep: newScreen => set({ lastStep: newScreen })
      }
    }),
    {
      name: 'journai-onboarding-progress',
      partialize: ({ actions, ...rest }: any) => rest
    }
  )
);

export const useOnboardingProgressActions = () => useOnboardingProgressStore(s => s.actions)
export const useOnboardingLastStep = () => useOnboardingProgressStore(s => s.lastStep)

export const parseLastStepFromLocalStorage = (): OnboardingStep => {
  try {
    const storeState = JSON.parse(typeof localStorage === 'object' ? localStorage.getItem('journai-onboarding-progress') ?? '{}' : '{}');
    return storeState['state']['lastStep'] as OnboardingStep;
  } catch (e) {
    console.log(e);
  }
  return 'start';
}
