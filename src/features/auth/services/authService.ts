import { apiClient } from '../../../core/api/client';
import { ENDPOINTS } from '../../../core/api/endpoints';
import { secureStorage } from '../../../core/storage/secureStorage';
import { APP_CONFIG } from '../../../app/config/constants';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
} from '../types';

interface ApiDataResponse<T> {
  data: T;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<ApiDataResponse<AuthResponse>>(
      ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return response.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<ApiDataResponse<AuthResponse>>(
      ENDPOINTS.AUTH.REGISTER,
      data
    );
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
    } catch {
      // Ignore logout errors, clear local state anyway
    } finally {
      await secureStorage.clear([
        APP_CONFIG.STORAGE_KEYS.ACCESS_TOKEN,
        APP_CONFIG.STORAGE_KEYS.REFRESH_TOKEN,
        APP_CONFIG.STORAGE_KEYS.USER_ID,
      ]);
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiDataResponse<User>>(ENDPOINTS.AUTH.ME);
    return response.data;
  },

  async deleteAccount(): Promise<void> {
    await apiClient.delete(ENDPOINTS.AUTH.DELETE_ACCOUNT);
    await secureStorage.clear([
      APP_CONFIG.STORAGE_KEYS.ACCESS_TOKEN,
      APP_CONFIG.STORAGE_KEYS.REFRESH_TOKEN,
      APP_CONFIG.STORAGE_KEYS.USER_ID,
      APP_CONFIG.STORAGE_KEYS.PENDING_RATINGS,
    ]);
  },

  async isLoggedIn(): Promise<boolean> {
    const token = await secureStorage.getItem(APP_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
    return !!token;
  },
};
