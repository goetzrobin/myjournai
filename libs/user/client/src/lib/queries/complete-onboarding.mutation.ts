import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from '~myjournai/http-client';
import { userQKF } from './query-key.factory';

export const useUserCompleteOnboardingMutation = ({ userId }: { userId?: string }, onSuccess?: () => void) => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => axios.post(`/api/users/${userId}/onboarding/complete`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userQKF.detail(userId) });
      onSuccess?.();
    }
  });
};
