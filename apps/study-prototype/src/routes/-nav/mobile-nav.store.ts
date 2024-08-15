import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useMobileNavStore = create(
  persist<{ isShowingMobileNav: boolean; actions: { setShowingMobileNav: (showing: boolean) => void } }>(
    (set, get) => ({
      isShowingMobileNav: false,
      actions: {
        setShowingMobileNav: (showing: boolean) => set(state => ({ ...state, isShowingMobileNav: showing }))
      }
    }), {
      name: 'journai-mobile-nav-store',
      partialize: ({ actions, ...rest }: any) => rest
    }
  ));

export const useMobileNavActions = () => useMobileNavStore(s => s.actions);
export const useMobileNavShowing = () => useMobileNavStore(s => s.isShowingMobileNav);
