import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useAxios } from '~myjournai/http-client';
import { LocalContextsListParams, localContextsQKF } from './query-key.factory';

// Types imported from shared package
import { LocalContextsQueryResult } from '~myjournai/contexts-shared';

// Extended params interface to include cohortId
export interface LocalContextsQueryParams extends LocalContextsListParams {
  cohortId?: string | null;
}

// Query hook for fetching local contexts with pagination
export const useLocalContextsQuery = ({ userId, params, options }: {
  userId: string;
  params: LocalContextsQueryParams;
  options?: UseQueryOptions<LocalContextsQueryResult>;
}) => {
  const axios = useAxios();

  // Build query string from params
  const queryParams = new URLSearchParams();
  queryParams.append('userId', userId);
  if (params.cursor) queryParams.append('cursor', params.cursor);
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.direction) queryParams.append('direction', params.direction);
  // Add cohortId to query params if provided
  if (params.cohortId) queryParams.append('cohortId', params.cohortId);

  const queryString = queryParams.toString();

  return useQuery({
    queryKey: localContextsQKF.list(userId, params),
    queryFn: () => axios.get<LocalContextsQueryResult>(`/api/contexts/local?${queryString}`).then(({ data }) => data),
    enabled: !!userId && !!params.cohortId, // Only enable query when both userId and cohortId are provided
    ...options
  });
};
