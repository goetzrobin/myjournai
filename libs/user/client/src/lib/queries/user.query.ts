import { QueryClient, queryOptions, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { userQKF } from './query-key.factory';
import { UserQR } from '~myjournai/user-shared';
import { useAxios } from '~myjournai/http-client';

export const userQueryOptions = (userId?: string | null) => {
  const axios = useAxios();
  return queryOptions({
    queryKey: userQKF.detail(userId),
    queryFn: () => axios.get<UserQR>(`/api/users/${userId}`).then(({ data }) => data),
    enabled: !!userId,
  });
}
export const useUserQuery = (userId?: string) =>
  useQuery(userQueryOptions(userId));
export const useUserSuspenseQuery = (userId?: string | null) =>
  useSuspenseQuery(userQueryOptions(userId));
export const ensureUserQuery = async (
  queryClient: QueryClient,
  userId?: string
) => await queryClient?.ensureQueryData(userQueryOptions(userId));
