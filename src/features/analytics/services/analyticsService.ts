import { apiClient } from '../../../core/api/client';
import { ENDPOINTS } from '../../../core/api/endpoints';
import { ProfileAnalytics, AnalyticsTrends } from '../types';

interface ApiDataResponse<T> {
  data: T;
}

export const analyticsService = {
  async getProfileAnalytics(): Promise<ProfileAnalytics> {
    const response = await apiClient.get<ApiDataResponse<ProfileAnalytics>>(
      ENDPOINTS.ANALYTICS.PROFILE
    );
    return response.data;
  },

  async getTraitTrends(period: 'weekly' | 'monthly' = 'weekly'): Promise<AnalyticsTrends> {
    const response = await apiClient.get<ApiDataResponse<AnalyticsTrends>>(
      ENDPOINTS.ANALYTICS.TRENDS,
      { params: { period } }
    );
    return response.data;
  },

  async getTraitBreakdown(): Promise<{ traits: { trait: string; count: number }[] }> {
    const response = await apiClient.get<
      ApiDataResponse<{ traits: { trait: string; count: number }[] }>
    >(ENDPOINTS.ANALYTICS.TRAITS);
    return response.data;
  },
};
