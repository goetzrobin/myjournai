import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useAxios } from '~myjournai/http-client';
import { PersonalContextsListParams, personalContextsQKF } from './query-key.factory';

// Types imported from shared package
import { PersonalContextsQueryResult } from '~myjournai/contexts-shared';

// Query hook for fetching personal contexts with pagination
export const usePersonalContextsQuery = ({ userId, params, options }: {
  userId: string;
  params: PersonalContextsListParams;
  options?: UseQueryOptions<PersonalContextsQueryResult>;
}) => {
  const axios = useAxios();

  // Build query string from params
  const queryParams = new URLSearchParams();
  queryParams.append('userId', userId);
  if (params.cursor) queryParams.append('cursor', params.cursor);
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.direction) queryParams.append('direction', params.direction);

  const queryString = queryParams.toString();

  return useQuery({
    queryKey: personalContextsQKF.list(userId, params),
    queryFn: () => axios.get<PersonalContextsQueryResult>(`/api/contexts/personal?${queryString}`).then(({ data }) => data),
    enabled: !!userId,
    ...options
  });
};

