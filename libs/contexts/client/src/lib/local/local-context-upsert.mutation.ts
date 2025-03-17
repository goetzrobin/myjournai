// Mutation hook for upserting local context
import { useAxios } from '~myjournai/http-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LocalContext, UpsertLocalContextCommand } from '~myjournai/contexts-shared';
import { localContextsQKF } from './query-key.factory';

export const useLocalContextUpsertMutation = ({ cohortId, onSuccess }: {
  cohortId: string;
  onSuccess?: () => void
}) => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: Omit<UpsertLocalContextCommand, 'cohortId'>) =>
      axios.post<{ data: LocalContext }>('/api/contexts/local', {
        ...params,
        cohortId
      }).then(({ data }) => data),
    onSuccess: async (response, variables) => {
      // Invalidate queries that might be affected
      await queryClient.invalidateQueries({
        queryKey: localContextsQKF.list(cohortId, { ...variables, cohortId })
      });

      // Also invalidate the specific context if we have an ID
      if (response?.data?.id) {
        await queryClient.invalidateQueries({
          queryKey: localContextsQKF.detail(response.data.id)
        });
      }

      // Call optional success callback
      onSuccess?.();
    }
  });
};
