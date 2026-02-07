import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../../navigation/types';
import { useCurrentUser } from '../../auth/hooks/useAuth';
import { useDailyAssignment } from '../hooks/useDailyAssignment';
import { useProfileAnalytics } from '../../analytics/hooks/useAnalytics';
import { useOfflineSync } from '../hooks/useOfflineSync';
import { colors, spacing, typography, borderRadius, theme } from '../../../shared/theme';
import { Skeleton } from '../../../shared/components';

type DashboardNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Dashboard'>;

export function DashboardScreen() {
  const navigation = useNavigation<DashboardNavigationProp>();
  const user = useCurrentUser();
  const { status, refetch } = useDailyAssignment();
  const analytics = useProfileAnalytics();
  const { pendingCount } = useOfflineSync();

  const handleStartRating = () => {
    if (status.type === 'pending') {
      navigation.navigate('RatingCard', { assignmentId: status.assignment.id });
    }
  };

  const renderAssignmentCard = () => {
    switch (status.type) {
      case 'loading':
        return (
          <View style={styles.ratingCard}>
            <ActivityIndicator color={colors.white} />
          </View>
        );

      case 'error':
        return (
          <TouchableOpacity style={styles.errorCard} onPress={() => refetch()}>
            <Text style={styles.errorTitle}>Something went wrong</Text>
            <Text style={styles.errorSubtitle}>Tap to retry</Text>
          </TouchableOpacity>
        );

      case 'pending':
        return (
          <TouchableOpacity style={styles.ratingCard} onPress={handleStartRating}>
            <View style={styles.ratingCardContent}>
              <Text style={styles.ratingCardTitle}>Today's Rating</Text>
              <Text style={styles.ratingCardSubtitle}>
                You have a new person to rate
              </Text>
            </View>
            <View style={styles.ratingCardAction}>
              <Text style={styles.ratingCardActionText}>Start</Text>
            </View>
          </TouchableOpacity>
        );

      case 'completed':
        return (
          <View style={styles.completedCard}>
            <Text style={styles.completedTitle}>Today's rating complete</Text>
            <Text style={styles.completedSubtitle}>
              Check back tomorrow for your next rating
            </Text>
          </View>
        );

      case 'no_assignment':
        return (
          <View style={styles.noRatingCard}>
            <Text style={styles.noRatingTitle}>All caught up!</Text>
            <Text style={styles.noRatingSubtitle}>
              {status.nextAt
                ? `Next rating available ${new Date(status.nextAt).toLocaleDateString()}`
                : 'Check back tomorrow for your next rating'}
            </Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.displayName || 'there'}</Text>
        <Text style={styles.date}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      <View style={styles.content}>
        {renderAssignmentCard()}

        {pendingCount > 0 && (
          <View style={styles.pendingBanner}>
            <Text style={styles.pendingText}>
              {pendingCount} rating{pendingCount > 1 ? 's' : ''} waiting to sync
            </Text>
          </View>
        )}

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Activity</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              {analytics.isLoading ? (
                <Skeleton width={40} height={32} />
              ) : (
                <Text style={styles.statValue}>
                  {analytics.data?.totalRatingsGiven ?? '--'}
                </Text>
              )}
              <Text style={styles.statLabel}>Ratings Given</Text>
            </View>
            <View style={styles.statCard}>
              {analytics.isLoading ? (
                <Skeleton width={40} height={32} />
              ) : (
                <Text style={styles.statValue}>
                  {analytics.data?.totalRatingsReceived ?? '--'}
                </Text>
              )}
              <Text style={styles.statLabel}>Ratings Received</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[4],
    paddingBottom: spacing[6],
  },
  greeting: {
    ...typography.styles.h3,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  date: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing[6],
  },
  ratingCard: {
    backgroundColor: colors.primary[600],
    borderRadius: borderRadius.xl,
    padding: spacing[5],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    ...theme.shadows.lg,
  },
  ratingCardContent: {
    flex: 1,
  },
  ratingCardTitle: {
    ...typography.styles.h4,
    color: colors.white,
    marginBottom: spacing[1],
  },
  ratingCardSubtitle: {
    ...typography.styles.bodySmall,
    color: colors.primary[100],
  },
  ratingCardAction: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.lg,
  },
  ratingCardActionText: {
    ...typography.styles.button,
    color: colors.primary[600],
  },
  errorCard: {
    backgroundColor: colors.error.main,
    borderRadius: borderRadius.xl,
    padding: spacing[5],
    alignItems: 'center',
  },
  errorTitle: {
    ...typography.styles.h4,
    color: colors.white,
    marginBottom: spacing[1],
  },
  errorSubtitle: {
    ...typography.styles.bodySmall,
    color: colors.white,
    opacity: 0.8,
  },
  completedCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing[6],
    alignItems: 'center',
  },
  completedTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  completedSubtitle: {
    ...typography.styles.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  noRatingCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing[6],
    alignItems: 'center',
  },
  noRatingTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  noRatingSubtitle: {
    ...typography.styles.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  pendingBanner: {
    marginTop: spacing[3],
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.lg,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    alignItems: 'center',
  },
  pendingText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  statsSection: {
    marginTop: spacing[8],
  },
  sectionTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginBottom: spacing[4],
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing[4],
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    alignItems: 'center',
  },
  statValue: {
    ...typography.styles.h2,
    color: colors.primary[600],
    marginBottom: spacing[1],
  },
  statLabel: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
});
