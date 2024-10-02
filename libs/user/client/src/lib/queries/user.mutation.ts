import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from '~myjournai/http-client';
import { userQKF } from './query-key.factory';
import { UserUpdateRequest } from '~myjournai/user-shared';

export const useUserUpdateMutation = ({ userId }: { userId?: string }, onSuccess?: () => void) => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UserUpdateRequest) => axios.post(`/api/users/${userId}`, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userQKF.detail(userId) });
      onSuccess?.();
    }
  });
};
