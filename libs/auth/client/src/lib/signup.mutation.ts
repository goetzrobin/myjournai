import { useMutation } from '@tanstack/react-query';
import { SignUpRequest } from '~myjournai/auth-shared';
import { useAxios } from '~myjournai/http-client';

export const useSignUpMutation = (onSuccess?: (data: any) => void) => {
  const axios = useAxios();
  return useMutation({
    mutationFn: (values: SignUpRequest) => axios.post('/api/auth/signup', values),
    onSuccess: (data) => onSuccess?.(data)
  });
};
