import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from '~myjournai/http-client';
import { userQKF } from '@myjournai/user-client';

export const useOnboardingUserDataMutation = ({ userId }: { userId?: string }, onSuccess?: () => void) => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => axios.post(`/api/users/${userId}/onboarding/data`, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userQKF.detail(userId) });
      onSuccess?.();
    }
  });
};

export const useOnboardingUserResetMutation = ({ userId }: { userId?: string }, onSuccess?: () => void) => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => axios.post(`/api/users/${userId}/onboarding/reset`, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userQKF.detail(userId) });
      onSuccess?.();
    }
  });
}
