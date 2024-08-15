import { useMutation } from '@tanstack/react-query';
import { useAxios } from '~myjournai/http-client';

export const useUserProfileCreateMutation = ({ userId }: { userId?: string }, onSuccess?: () => void) => {
  const axios = useAxios();
  return useMutation({
    mutationFn: () => axios.post(`/api/users/${userId}/profile`),
    onSuccess: async () => {
      onSuccess?.();
    }
  });
};
