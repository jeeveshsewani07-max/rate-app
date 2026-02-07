import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';
import { env } from '../../app/config/env';
import { APP_CONFIG } from '../../app/config/constants';
import { secureStorage } from '../storage/secureStorage';
import { ApiError, ApiErrorResponse, RefreshTokenResponse } from './types';
import { ENDPOINTS } from './endpoints';

interface QueuedRequest {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}

class ApiClient {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private requestQueue: QueuedRequest[] = [];
  private onSessionExpired?: () => void;

  constructor() {
    this.instance = axios.create({
      baseURL: env.apiBaseUrl,
      timeout: APP_CONFIG.REQUEST_TIMEOUT_MS,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.setupInterceptors();
  }

  setSessionExpiredCallback(callback: () => void): void {
    this.onSessionExpired = callback;
  }

  private setupInterceptors(): void {
    // Request interceptor - attach access token
    this.instance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await secureStorage.getItem(APP_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle token refresh
    this.instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiErrorResponse>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        // Handle 401 - attempt token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Queue the request while refreshing
            return new Promise((resolve, reject) => {
              this.requestQueue.push({
                resolve: (token: string) => {
                  if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                  }
                  resolve(this.instance(originalRequest));
                },
                reject,
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const newToken = await this.refreshAccessToken();
            this.processQueue(newToken);
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return this.instance(originalRequest);
          } catch (refreshError) {
            this.processQueue(null);
            this.onSessionExpired?.();
            throw refreshError;
          } finally {
            this.isRefreshing = false;
          }
        }

        // Transform error to ApiError
        if (error.response?.data) {
          throw new ApiError({
            ...error.response.data,
            statusCode: error.response.status,
          });
        }

        throw new ApiError({
          code: 'NETWORK_ERROR',
          message: error.message || 'Network request failed',
          statusCode: 0,
        });
      }
    );
  }

  private async refreshAccessToken(): Promise<string> {
    const refreshToken = await secureStorage.getItem(
      APP_CONFIG.STORAGE_KEYS.REFRESH_TOKEN
    );

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post<RefreshTokenResponse>(
      `${env.apiBaseUrl}${ENDPOINTS.AUTH.REFRESH}`,
      { refreshToken }
    );

    const { accessToken, refreshToken: newRefreshToken } = response.data.data;

    await secureStorage.multiSet({
      [APP_CONFIG.STORAGE_KEYS.ACCESS_TOKEN]: accessToken,
      [APP_CONFIG.STORAGE_KEYS.REFRESH_TOKEN]: newRefreshToken,
    });

    return accessToken;
  }

  private processQueue(token: string | null): void {
    this.requestQueue.forEach((request) => {
      if (token) {
        request.resolve(token);
      } else {
        request.reject(new Error('Token refresh failed'));
      }
    });
    this.requestQueue = [];
  }

  // HTTP methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
