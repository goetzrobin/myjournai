// Mutation hook for upserting global context
import { useAxios } from '~myjournai/http-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GlobalContext, GlobalContextUpsertRequest } from '~myjournai/contexts-shared';
import { GlobalContextsListParams, globalContextsQKF } from './query-key.factory';

export const useGlobalContextUpsertMutation = ({ params, onSuccess }: {
  params?: GlobalContextsListParams;
  onSuccess?: () => void
}) => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GlobalContextUpsertRequest) =>
      axios.post<{ data: GlobalContext }>('/api/contexts/global', data).then(({ data }) => data),
    onSuccess: async (response) => {
      // Invalidate queries that might be affected
      await queryClient.invalidateQueries({
        queryKey: globalContextsQKF.list(params)
      });

      // Also invalidate the specific context if we have an ID
      if (response?.data?.id) {
        await queryClient.invalidateQueries({
          queryKey: globalContextsQKF.detail(response.data.id)
        });
      }

      // Call optional success callback
      onSuccess?.();
    }
  });
};
