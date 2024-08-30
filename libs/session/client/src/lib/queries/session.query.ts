import { useAxios } from '~myjournai/http-client';
import { useQuery } from '@tanstack/react-query';
import { sessionQKF } from './query-key.factory';
import { SessionWithLogs } from '~myjournai/session-shared';

export const useSessionsWithLogsQuery = ({ userId }: {userId?: string | null}) => {
  const axios = useAxios();
  return useQuery({
    queryKey: sessionQKF.withLogsList(userId),
    queryFn: () => axios.get<SessionWithLogs[]>(`/api/users/${userId}/sessions`).then(({ data }) => data),
    enabled: !!userId
  });
}
