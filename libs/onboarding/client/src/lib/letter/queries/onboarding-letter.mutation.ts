import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from '~myjournai/http-client';
import { onboardingLetterQKF } from './query-key.factory';
import { UpsertOnboardingLetterRequest } from '~myjournai/onboarding-shared';

export const useOnboardingLetterMutation = (userId: string | null | undefined, onSuccess?: () => void) => {
  const axios = useAxios();
  const qC = useQueryClient();
  return useMutation({
    mutationFn: (data: UpsertOnboardingLetterRequest) => axios.post(`/api/onboarding/letters/${userId}`, data),
    onSuccess: async () => {
      await qC.invalidateQueries({
        queryKey: onboardingLetterQKF.entry(userId)
      });
      return onSuccess?.();
    }
  });
};
