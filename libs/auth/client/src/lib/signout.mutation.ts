import { useMutation } from '@tanstack/react-query';
import { useAxios } from '~myjournai/http-client';

export const useSignOutMutation = (onSuccess?: () => void) => {
  const axios = useAxios()
  return useMutation({
    mutationFn: () => axios.post('/api/auth/signout'),
    onSuccess: () => onSuccess?.(),
  });
};
