import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';
import { LoginRequest, RegisterRequest } from '../types';

export function useLogin() {
  const login = useAuthStore((state) => state.login);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: async (data) => {
      await login(data);
      // Invalidate all queries on login to refetch with new auth
      queryClient.invalidateQueries();
    },
  });
}

export function useRegister() {
  const login = useAuthStore((state) => state.login);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: async (data) => {
      await login(data);
      queryClient.invalidateQueries();
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: async () => {
      await logout();
      // Clear all cached queries
      queryClient.clear();
    },
  });
}

export function useDeleteAccount() {
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.deleteAccount(),
    onSuccess: async () => {
      await logout();
      queryClient.clear();
    },
  });
}

export function useAuthState() {
  return useAuthStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    isInitialized: state.isInitialized,
  }));
}

export function useCurrentUser() {
  return useAuthStore((state) => state.user);
}
