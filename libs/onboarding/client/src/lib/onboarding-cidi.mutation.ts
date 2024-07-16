import { useMutation } from '@tanstack/react-query';
import { useAxios } from '~myjournai/http-client';
import { CreateUserCidiResponseRequest } from '~myjournai/onboarding-server';

export const useOnboardingCidiDataMutation = (onSuccess?: () => void) => {
  const axios = useAxios();
  return useMutation({
    mutationFn: (data: CreateUserCidiResponseRequest, ) => axios.post(`/api/cidi`, data),
    onSuccess: async () => {
      onSuccess?.();
    }
  });
};
