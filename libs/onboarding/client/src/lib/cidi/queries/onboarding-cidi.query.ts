import { useQuery } from '@tanstack/react-query';
import { useAxios } from '~myjournai/http-client';
import { cidiQKF } from './query-key.factory';

export const useOnboardingCidiPreQuery = (userId: string | null | undefined) => {
  const axios = useAxios();
  return useQuery({
    queryKey: cidiQKF.pre(userId),
    queryFn: () => axios.get(`/api/cidi/pre/${userId}`).then(({data}) => data),
  });
};
