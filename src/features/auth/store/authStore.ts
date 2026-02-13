import { create } from 'zustand';
import { secureStorage } from '../../../core/storage/secureStorage';
import { APP_CONFIG } from '../../../bootstrap/config/constants';
import { AuthStore, AuthResponse, User } from '../types';
import { apiClient } from '../../../core/api/client';

export const useAuthStore = create<AuthStore>((set, get) => ({
  // State
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,

  // Actions
  setUser: (user: User | null) => {
    set({ user, isAuthenticated: !!user });
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  setInitialized: (isInitialized: boolean) => {
    set({ isInitialized });
  },

  login: async (response: AuthResponse) => {
    const { user, tokens } = response;

    // Store tokens securely
    await secureStorage.multiSet({
      [APP_CONFIG.STORAGE_KEYS.ACCESS_TOKEN]: tokens.accessToken,
      [APP_CONFIG.STORAGE_KEYS.REFRESH_TOKEN]: tokens.refreshToken,
      [APP_CONFIG.STORAGE_KEYS.USER_ID]: user.id,
    });

    set({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: async () => {
    // Clear stored tokens
    await secureStorage.clear([
      APP_CONFIG.STORAGE_KEYS.ACCESS_TOKEN,
      APP_CONFIG.STORAGE_KEYS.REFRESH_TOKEN,
      APP_CONFIG.STORAGE_KEYS.USER_ID,
    ]);

    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  initialize: async () => {
    try {
      set({ isLoading: true });

      const accessToken = await secureStorage.getItem(
        APP_CONFIG.STORAGE_KEYS.ACCESS_TOKEN
      );

      if (!accessToken) {
        set({ isInitialized: true, isLoading: false });
        return;
      }

      // Validate token by fetching current user
      const response = await apiClient.get<{ data: User }>('/auth/me');

      set({
        user: response.data,
        isAuthenticated: true,
        isInitialized: true,
        isLoading: false,
      });
    } catch (error) {
      // Token invalid, clear storage
      await get().logout();
      set({ isInitialized: true, isLoading: false });
    }
  },

  updateUser: (updates: Partial<User>) => {
    const currentUser = get().user;
    if (currentUser) {
      set({ user: { ...currentUser, ...updates } });
    }
  },
}));

// Set up session expired callback
apiClient.setSessionExpiredCallback(() => {
  useAuthStore.getState().logout();
});

// Selectors
export const selectUser = (state: AuthStore) => state.user;
export const selectIsAuthenticated = (state: AuthStore) => state.isAuthenticated;
export const selectIsLoading = (state: AuthStore) => state.isLoading;
export const selectIsInitialized = (state: AuthStore) => state.isInitialized;
