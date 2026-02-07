import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useOfflineQueueStore } from '../store/offlineQueueStore';
import { useIsOnline } from '../../../core/hooks/useNetworkStatus';
import { useOnForeground } from '../../../core/hooks/useAppState';
import { ratingService } from '../services/ratingService';

const SYNC_INTERVAL = 30000; // 30 seconds

export function useOfflineSync() {
  const queryClient = useQueryClient();
  const isOnline = useIsOnline();
  const {
    pendingRatings,
    isSyncing,
    setSyncing,
    removePendingRating,
    incrementRetryCount,
    setLastSyncAttempt,
    getNextPending,
  } = useOfflineQueueStore();

  const syncPendingRatings = useCallback(async () => {
    if (!isOnline || isSyncing || pendingRatings.length === 0) {
      return;
    }

    setSyncing(true);
    setLastSyncAttempt(new Date().toISOString());

    try {
      // Process one at a time to maintain order
      const pending = getNextPending();
      if (!pending) {
        setSyncing(false);
        return;
      }

      try {
        await ratingService.submitRating(pending.assignmentId, pending.traits);
        removePendingRating(pending.id);

        // Invalidate queries after successful sync
        queryClient.invalidateQueries({ queryKey: ['daily-assignment'] });
        queryClient.invalidateQueries({ queryKey: ['analytics'] });

        // Continue syncing if there are more
        if (pendingRatings.length > 1) {
          // Small delay before next sync
          setTimeout(() => syncPendingRatings(), 1000);
        }
      } catch (error) {
        console.error('Failed to sync rating:', error);
        incrementRetryCount(pending.id);
      }
    } finally {
      setSyncing(false);
    }
  }, [
    isOnline,
    isSyncing,
    pendingRatings.length,
    setSyncing,
    setLastSyncAttempt,
    getNextPending,
    removePendingRating,
    incrementRetryCount,
    queryClient,
  ]);

  // Sync when coming online
  useEffect(() => {
    if (isOnline && pendingRatings.length > 0) {
      syncPendingRatings();
    }
  }, [isOnline]);

  // Sync when app comes to foreground
  useOnForeground(() => {
    if (isOnline && pendingRatings.length > 0) {
      syncPendingRatings();
    }
  });

  // Periodic sync attempt
  useEffect(() => {
    const interval = setInterval(() => {
      if (isOnline && pendingRatings.length > 0) {
        syncPendingRatings();
      }
    }, SYNC_INTERVAL);

    return () => clearInterval(interval);
  }, [isOnline, pendingRatings.length, syncPendingRatings]);

  return {
    pendingCount: pendingRatings.length,
    isSyncing,
    syncNow: syncPendingRatings,
  };
}
