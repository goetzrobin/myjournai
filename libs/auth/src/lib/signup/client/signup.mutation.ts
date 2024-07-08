import { useMutation } from '@tanstack/react-query';
import { SignUpRequest } from '../signup-request';

export const useSignUpMutation = (onSuccess?: (data: any) => void) => {
  return useMutation({
    mutationFn: (values: SignUpRequest) => fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(values)
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      }),
    onSuccess: data => onSuccess?.(data)
  });
};
