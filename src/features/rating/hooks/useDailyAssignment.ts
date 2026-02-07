import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ratingService } from '../services/ratingService';
import { useOfflineQueueStore } from '../store/offlineQueueStore';
import { useIsOnline } from '../../../core/hooks/useNetworkStatus';
import { Trait } from '../../../app/config/constants';
import { AssignmentStatus } from '../types';

const QUERY_KEY = ['daily-assignment'];

export function useDailyAssignment() {
  const queryClient = useQueryClient();
  const isOnline = useIsOnline();

  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => ratingService.getDailyAssignment(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    enabled: isOnline,
  });

  const getStatus = (): AssignmentStatus => {
    if (query.isLoading) {
      return { type: 'loading' };
    }

    if (query.isError) {
      return {
        type: 'error',
        message: query.error instanceof Error ? query.error.message : 'Failed to load',
      };
    }

    if (!query.data) {
      return { type: 'no_assignment', nextAt: null };
    }

    const { data: assignment, nextAssignmentAt } = query.data;

    if (!assignment) {
      return { type: 'no_assignment', nextAt: nextAssignmentAt };
    }

    if (assignment.status === 'completed') {
      return { type: 'completed', nextAt: nextAssignmentAt || '' };
    }

    return { type: 'pending', assignment };
  };

  return {
    ...query,
    status: getStatus(),
    refetch: query.refetch,
  };
}

export function useSubmitRating() {
  const queryClient = useQueryClient();
  const isOnline = useIsOnline();
  const { addPendingRating } = useOfflineQueueStore();

  return useMutation({
    mutationFn: async ({
      assignmentId,
      traits,
    }: {
      assignmentId: string;
      traits: Trait[];
    }) => {
      if (!isOnline) {
        // Queue for later submission
        addPendingRating(assignmentId, traits);
        return { queued: true };
      }

      await ratingService.submitRating(assignmentId, traits);
      return { queued: false };
    },
    onSuccess: (result) => {
      // Optimistically update the assignment status
      queryClient.setQueryData(QUERY_KEY, (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            status: 'completed',
          },
        };
      });

      // Invalidate to refetch fresh data
      if (!result.queued) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: ['analytics'] });
      }
    },
  });
}

export function useRatingHistory(enabled: boolean = true) {
  return useQuery({
    queryKey: ['rating-history'],
    queryFn: () => ratingService.getRatingHistory(),
    enabled,
  });
}
