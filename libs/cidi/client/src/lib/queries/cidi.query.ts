import { useQuery } from '@tanstack/react-query';
import { useAxios } from '~myjournai/http-client';
import { cidiQKF } from './query-key.factory';
import { CidiSurveyResponses } from '~db/schema/cidi-survey-responses';

export const useCidiPreQuery = (userId: string | null | undefined) => {
  const axios = useAxios();
  return useQuery({
    queryKey: cidiQKF.pre(userId),
    queryFn: () => axios.get<CidiSurveyResponses>(`/api/cidi/pre/${userId}`).then(({data}) => data),
  });
};

export const useCidiPostQuery = (userId: string | null | undefined) => {
  const axios = useAxios();
  return useQuery({
    queryKey: cidiQKF.post(userId),
    queryFn: () => axios.get<CidiSurveyResponses>(`/api/cidi/post/${userId}`).then(({data}) => data),
  });
};

