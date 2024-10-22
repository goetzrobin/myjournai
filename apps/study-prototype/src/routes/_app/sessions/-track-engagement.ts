import { useCallback, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { parseISO } from 'date-fns';
import { useAxios } from '~myjournai/http-client';

const reviver = (key: string, value: unknown) => {
  return key === 'engagementStartTime' ? parseISO(value as string) : value;
};
export const useEngagementStoreFactory = (sessionLogId?: string) => create(
  persist<{
    engagementStartTime: Date | undefined; actions: {
      setEngagementStartTime(time: Date): void;
      clearEngagementStartTime(): void;
    }
  }>(
    (set, get) => ({
      engagementStartTime: undefined,
      actions: {
        setEngagementStartTime: (time: Date) => set({ engagementStartTime: time }),
        clearEngagementStartTime: () => set({ engagementStartTime: undefined })
      }
    }), {
      name: `journai-session-log-engagement-${sessionLogId}-store`,
      partialize: ({ actions, ...rest }: any) => rest,
      storage: createJSONStorage(() => localStorage, { reviver })
    }
  ));
export const useSessionLogEngagementMutation = ({ sessionLogId, onSuccess }: {
  sessionLogId?: string;
  onSuccess?(data: any): void;
}) => {
  const axios = useAxios();
  return useMutation({
    mutationFn: (values: {
      sessionLogId: string
      startedAt: Date
      endedAt: Date
      endReason: 'SUCCESS' | 'TIMEOUT'
    }) => axios.post(`/api/session-logs/${sessionLogId}/engagements`, values),
    onSuccess: (data) => onSuccess?.(data)
  });
};

export function useEngagementTracker({ sessionLogId }: {
  sessionLogId: string | undefined
}) {
  const logEngagement = useSessionLogEngagementMutation({ sessionLogId });
  const useEngagementStore = useEngagementStoreFactory(sessionLogId);
  const store = useEngagementStore();

  const startSessionAwareEngagement = () => {
    if (!sessionLogId) return;
    store.actions.setEngagementStartTime(new Date());
  }

  const endEngagementSession = useCallback(() => {
    const potentialStartTime = store.engagementStartTime;

    if (!potentialStartTime || !sessionLogId) return;

    const endTime = new Date();
    const durationMs = endTime.getTime() - potentialStartTime.getTime()
    const durationSeconds = durationMs / 1000;
    const durationMinutes = durationSeconds / 60;

    const endReason = durationMinutes > 30 ? 'TIMEOUT' : 'SUCCESS';

    if (durationSeconds > 5) {
      logEngagement.mutate({
        sessionLogId,
        startedAt: potentialStartTime,
        endedAt: endTime,
        endReason
      });
    }
    if (durationMs > 300) {
      store.actions.clearEngagementStartTime();
    }
  }, [store.engagementStartTime, sessionLogId]);

  const handleVisibilityChange = () => {
    if(document.hidden) {
      endEngagementSession();
    } else {
      startSessionAwareEngagement();
    }
  };

  useEffect(() => {
    startSessionAwareEngagement();
  }, [sessionLogId]);

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      endEngagementSession();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  }, [sessionLogId, endEngagementSession]);

  return {
    endEngagement: () => endEngagementSession()
  };
}
