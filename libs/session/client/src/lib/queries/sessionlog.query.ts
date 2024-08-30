import { useAxios } from '~myjournai/http-client';
import { useQuery } from '@tanstack/react-query';
import { BaseMessage } from '~myjournai/chat-shared';
import { sessionQKF } from './query-key.factory';
import { SessionLog } from '~myjournai/sessionlog-shared';

export const useSessionLogMessagesQuery = (sessionLogId: string | undefined) => {
  const axios = useAxios();
  return useQuery({
    queryKey: sessionQKF.logDetailMessages(sessionLogId),
    //TODO: add cursor type pagination
    queryFn: () => axios.get<BaseMessage[]>(`/api/session-logs/${sessionLogId}/messages`).then(({ data }) => data),
    enabled: !!sessionLogId
  });
};

export const useLatestSessionLogBySlugQuery = ({ slug, userId }: {
  slug: string | undefined,
  userId: string | undefined
}) => {
  const axios = useAxios();
  return useQuery({
    queryKey: sessionQKF.logDetailBySlug(slug, userId),
    queryFn: () => axios.get<SessionLog | undefined>(`/api/users/${userId}/sessions/slug/${slug}/session-logs/latest`).then(({ data }) => data),
    enabled: !!slug && !!userId
  });
};
