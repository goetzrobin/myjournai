import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from '~myjournai/http-client';
import { cidiQKF } from './query-key.factory';
import { CreateUserCidiResponseRequest } from '~myjournai/user-shared';
import { SurveyActualAnswer } from '~myjournai/survey';

export const useCidiDataMutation = ({ userId, onSuccess, scope = 'pre' }: {
  userId: string | null | undefined;
  onSuccess?: () => void,
  scope?: 'pre' | 'post'
}) => {
  const axios = useAxios();
  const qC = useQueryClient();
  return useMutation({
    scope: {
      id: `cidi-${scope}-data`
    },
    mutationFn: (data: CreateUserCidiResponseRequest) => axios.post(`/api/cidi/${scope}/${userId}`, data),
    onSuccess: async () => {
      await qC.invalidateQueries({
        queryKey: scope === 'pre' ? cidiQKF.pre(userId) : cidiQKF.post(userId)
      });
      return onSuccess?.();
    }
  });
};

export const buildCreateUserCidiResponseRequest = (keyPrefix = 'question1', fromAnswers: (SurveyActualAnswer | undefined)[], userId: string): CreateUserCidiResponseRequest => {
  let answersReq = {};
  fromAnswers.forEach((a, i) => answersReq = ({ ...answersReq, [keyPrefix + i]: a?.value }));
  return {
    userId: userId,
    ...answersReq
  };
};
