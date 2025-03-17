import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useAxios } from '~myjournai/http-client';
import { GlobalContextsListParams, globalContextsQKF } from './query-key.factory';

// Types imported from shared package
import { GlobalContextsQueryResult } from '~myjournai/contexts-shared';

// Query hook for fetching global contexts with pagination
export const useGlobalContextsQuery = ({ params, options }: {
  params: GlobalContextsListParams;
  options?: UseQueryOptions<GlobalContextsQueryResult>;
}) => {
  const axios = useAxios();

  // Build query string from params
  const queryParams = new URLSearchParams();
  if (params.cursor) queryParams.append('cursor', params.cursor);
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.direction) queryParams.append('direction', params.direction);

  const queryString = queryParams.toString();

  return useQuery({
    queryKey: globalContextsQKF.list(params),
    queryFn: () => axios.get<GlobalContextsQueryResult>(`/api/contexts/global?${queryString}`).then(({ data }) => data),
    ...options
  });
};

