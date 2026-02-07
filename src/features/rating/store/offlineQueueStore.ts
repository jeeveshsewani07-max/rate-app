import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PendingRating } from '../types';
import { Trait } from '../../../app/config/constants';

interface OfflineQueueState {
  pendingRatings: PendingRating[];
  isSyncing: boolean;
  lastSyncAttempt: string | null;
}

interface OfflineQueueActions {
  addPendingRating: (assignmentId: string, traits: Trait[]) => string;
  removePendingRating: (id: string) => void;
  incrementRetryCount: (id: string) => void;
  setSyncing: (syncing: boolean) => void;
  setLastSyncAttempt: (timestamp: string) => void;
  getPendingCount: () => number;
  getNextPending: () => PendingRating | null;
  clearAll: () => void;
}

type OfflineQueueStore = OfflineQueueState & OfflineQueueActions;

const MAX_RETRIES = 5;

export const useOfflineQueueStore = create<OfflineQueueStore>()(
  persist(
    (set, get) => ({
      // State
      pendingRatings: [],
      isSyncing: false,
      lastSyncAttempt: null,

      // Actions
      addPendingRating: (assignmentId: string, traits: Trait[]) => {
        const id = `pending_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const pending: PendingRating = {
          id,
          assignmentId,
          traits,
          createdAt: new Date().toISOString(),
          retryCount: 0,
        };

        set((state) => ({
          pendingRatings: [...state.pendingRatings, pending],
        }));

        return id;
      },

      removePendingRating: (id: string) => {
        set((state) => ({
          pendingRatings: state.pendingRatings.filter((r) => r.id !== id),
        }));
      },

      incrementRetryCount: (id: string) => {
        set((state) => ({
          pendingRatings: state.pendingRatings.map((r) =>
            r.id === id ? { ...r, retryCount: r.retryCount + 1 } : r
          ).filter((r) => r.retryCount <= MAX_RETRIES),
        }));
      },

      setSyncing: (isSyncing: boolean) => {
        set({ isSyncing });
      },

      setLastSyncAttempt: (timestamp: string) => {
        set({ lastSyncAttempt: timestamp });
      },

      getPendingCount: () => {
        return get().pendingRatings.length;
      },

      getNextPending: () => {
        const pending = get().pendingRatings;
        if (pending.length === 0) return null;
        // Return oldest first
        return pending.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )[0];
      },

      clearAll: () => {
        set({ pendingRatings: [], lastSyncAttempt: null });
      },
    }),
    {
      name: 'offline-rating-queue',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        pendingRatings: state.pendingRatings,
        lastSyncAttempt: state.lastSyncAttempt,
      }),
    }
  )
);
