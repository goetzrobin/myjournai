import { useQuery } from '@tanstack/react-query';
import { useAxios } from '~myjournai/http-client';
import { onboardingLetterQKF } from './query-key.factory';
import { OnboardingLetterQR } from '~myjournai/onboarding-shared';

export const useOnboardingLetterQuery = (userId: string | null | undefined) => {
  const axios = useAxios();
  return useQuery({
    queryKey: onboardingLetterQKF.entry(userId),
    queryFn: () => axios.get<OnboardingLetterQR>(`/api/onboarding/letters/${userId}`).then(({data}) => data),
  });
};
