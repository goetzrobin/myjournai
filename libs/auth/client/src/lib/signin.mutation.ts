import { useMutation } from '@tanstack/react-query';
import { SignInRequest } from '~myjournai/auth-shared';
import { useAxios } from '~myjournai/http-client';

export const useSignInMutation = (onSuccess?: (data: any) => void) => {
  const axios = useAxios()
  return useMutation({
    mutationFn: (values: SignInRequest) => axios.post('/api/auth/signin', values),
    onSuccess: (data) => onSuccess?.(data),
  });
};
