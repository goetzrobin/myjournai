// Mutation hook for upserting personal context
import { useAxios } from '~myjournai/http-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PersonalContext, UpsertPersonalContextCommand } from '~myjournai/contexts-shared';
import { PersonalContextsListParams, personalContextsQKF } from './query-key.factory';

export const usePersonalContextUpsertMutation = ({ userId, params, onSuccess }: {
  userId: string;
  params?: PersonalContextsListParams;
  onSuccess?: () => void
}) => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<UpsertPersonalContextCommand, 'userId'>) =>
      axios.post<{ data: PersonalContext }>('/api/contexts/personal', {
        ...data,
        userId
      }).then(({ data }) => data),
    onSuccess: async (response) => {
      // Invalidate queries that might be affected
      await queryClient.invalidateQueries({
        queryKey: personalContextsQKF.list(userId, params)
      });

      // Also invalidate the specific context if we have an ID
      if (response?.data?.id) {
        await queryClient.invalidateQueries({
          queryKey: personalContextsQKF.detail(response.data.id)
        });
      }

      // Call optional success callback
      onSuccess?.();
    }
  });
};
