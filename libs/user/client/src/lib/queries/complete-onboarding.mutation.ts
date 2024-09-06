import { useMutation } from '@tanstack/react-query';
import { useAxios } from '~myjournai/http-client';

export const useUserCompleteOnboardingMutation = ({ userId }: { userId?: string }, onSuccess?: () => void) => {
  const axios = useAxios();
  return useMutation({
    mutationFn: () => axios.post(`/api/users/${userId}/onboarding/complete`),
    onSuccess: async () => {
      onSuccess?.();
    }
  });
};
