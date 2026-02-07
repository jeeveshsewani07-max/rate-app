import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/analyticsService';

const ANALYTICS_STALE_TIME = 1000 * 60 * 10; // 10 minutes

export function useProfileAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'profile'],
    queryFn: () => analyticsService.getProfileAnalytics(),
    staleTime: ANALYTICS_STALE_TIME,
  });
}

export function useTraitTrends(period: 'weekly' | 'monthly' = 'weekly') {
  return useQuery({
    queryKey: ['analytics', 'trends', period],
    queryFn: () => analyticsService.getTraitTrends(period),
    staleTime: ANALYTICS_STALE_TIME,
  });
}

export function useTraitBreakdown() {
  return useQuery({
    queryKey: ['analytics', 'traits'],
    queryFn: () => analyticsService.getTraitBreakdown(),
    staleTime: ANALYTICS_STALE_TIME,
  });
}
