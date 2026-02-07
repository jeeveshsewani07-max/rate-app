import { apiClient } from '../../../core/api/client';
import { ENDPOINTS } from '../../../core/api/endpoints';
import { Trait } from '../../../app/config/constants';
import {
  DailyAssignment,
  DailyAssignmentResponse,
  RatingSubmission,
  RatingHistoryItem,
} from '../types';

interface ApiDataResponse<T> {
  data: T;
}

export const ratingService = {
  async getDailyAssignment(): Promise<DailyAssignmentResponse> {
    const response = await apiClient.get<ApiDataResponse<DailyAssignmentResponse>>(
      ENDPOINTS.RATINGS.DAILY_ASSIGNMENT
    );
    return response.data;
  },

  async submitRating(assignmentId: string, traits: Trait[]): Promise<void> {
    await apiClient.post(ENDPOINTS.RATINGS.SUBMIT, {
      assignmentId,
      traits,
      submittedAt: new Date().toISOString(),
    });
  },

  async getRatingHistory(
    page: number = 1,
    limit: number = 20
  ): Promise<{ items: RatingHistoryItem[]; hasMore: boolean }> {
    const response = await apiClient.get<
      ApiDataResponse<{ items: RatingHistoryItem[]; hasMore: boolean }>
    >(ENDPOINTS.RATINGS.HISTORY, {
      params: { page, limit },
    });
    return response.data;
  },

  async getPendingRatingsCount(): Promise<number> {
    const response = await apiClient.get<ApiDataResponse<{ count: number }>>(
      ENDPOINTS.RATINGS.PENDING
    );
    return response.data.count;
  },
};
