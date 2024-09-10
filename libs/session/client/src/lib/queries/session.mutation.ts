import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from '~myjournai/http-client';
import {
  AbortSessionResponse,
  EndSessionRequest,
  EndSessionResponse,
  StartSessionRequest,
  StartSessionResponse
} from '~myjournai/session-shared';
import { sessionQKF } from './query-key.factory';

export const useSessionStartMutation = ({ userId, slug, onSuccess }: {
  userId?: string;
  slug?: string;
  onSuccess?: () => void
}) => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: StartSessionRequest) => {
      if (!userId || !slug) {
        throw Error('provide userId and slug');
      }
      return axios.post<StartSessionRequest, StartSessionResponse>(`/api/users/${userId}/sessions/slug/${slug}/start`, data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: sessionQKF.logDetailBySlug(slug, userId) });
      onSuccess?.();
    }
  });
};


export const useSessionEndMutation = ({ userId, sessionLogId, onSuccess }: {
  userId?: string;
  sessionLogId?: string;
  onSuccess?: () => void
}) => {

  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EndSessionRequest) => {
      if (!userId || !sessionLogId) {
        throw Error('provide userId and sessionLogId');
      }
      return axios.post<EndSessionRequest, EndSessionResponse>(`/api/session-logs/${sessionLogId}/end`, data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: sessionQKF.logDetails(userId) });
      onSuccess?.();
    }
  });
};


export const useSessionAbortMutation = ({ userId, sessionLogId, onSuccess }: {
  userId?: string;
  sessionLogId?: string;
  onSuccess?: () => void
}) => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      console.log('yoooo')
      if (!userId || !sessionLogId) {
        throw Error('provide userId and sessionLogId');
      }
      return axios.post<never, AbortSessionResponse>(`/api/session-logs/${sessionLogId}/abort`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: sessionQKF.logDetails(userId) });
      onSuccess?.();
    }
  });
};
