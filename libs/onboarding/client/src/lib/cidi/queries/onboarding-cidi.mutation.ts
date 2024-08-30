import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from '~myjournai/http-client';
import { OnboardingActualAnswer } from '../../onboarding-survey';
import { cidiQKF } from './query-key.factory';
import { CreateUserCidiResponseRequest } from '@myjournai/user-shared';

export const useOnboardingCidiDataMutation = (userId: string | null | undefined, onSuccess?: () => void) => {
  const axios = useAxios();
  const qC = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserCidiResponseRequest) => axios.post(`/api/cidi/pre/${userId}`, data),
    onSuccess: async () => {
      await qC.invalidateQueries({
        queryKey: cidiQKF.pre(userId)
      });
      return onSuccess?.();
    }
  });
};

export const buildCreateUserCidiResponseRequest = (keyPrefix = 'question1', fromAnswers: (OnboardingActualAnswer | undefined)[], userId: string): CreateUserCidiResponseRequest => {
  let answersReq = {};
  fromAnswers.forEach((a, i) => answersReq = ({ ...answersReq, [keyPrefix + i]: a?.value }));
  return {
    userId: userId,
    ...answersReq
  };
};
