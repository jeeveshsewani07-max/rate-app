import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProfileAnalytics } from '../hooks/useAnalytics';
import { TraitStat } from '../types';
import { colors, spacing, typography, borderRadius, theme } from '../../../shared/theme';
import { Skeleton, EmptyState } from '../../../shared/components';

export function ProfileAnalyticsScreen() {
  const { data, isLoading, isError, refetch } = useProfileAnalytics();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Your Profile</Text>
            <Text style={styles.subtitle}>How others see you</Text>
          </View>
          <View style={styles.overviewCard}>
            <Skeleton width={60} height={40} />
            <Skeleton width={160} height={16} style={{ marginTop: 8 }} />
          </View>
          <View style={styles.section}>
            <Skeleton width={100} height={20} />
            <View style={{ gap: spacing[3], marginTop: spacing[4] }}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} height={56} borderRadius={borderRadius.lg} />
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Profile</Text>
          <Text style={styles.subtitle}>How others see you</Text>
        </View>
        <EmptyState
          icon="alert-circle-outline"
          title="Failed to load analytics"
          description="Something went wrong. Please try again."
          actionLabel="Retry"
          onAction={() => refetch()}
        />
      </SafeAreaView>
    );
  }

  const totalRatings = data?.totalRatingsReceived ?? 0;
  const topTraits: TraitStat[] = data?.topTraits ?? [];

  if (totalRatings === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Profile</Text>
          <Text style={styles.subtitle}>How others see you</Text>
        </View>
        <EmptyState
          icon="bar-chart-outline"
          title="No ratings yet"
          description="Once others rate you, your trait analytics will appear here."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Profile</Text>
          <Text style={styles.subtitle}>How others see you</Text>
        </View>

        <View style={styles.overviewCard}>
          <Text style={styles.overviewValue}>{totalRatings}</Text>
          <Text style={styles.overviewLabel}>Total Ratings Received</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Traits</Text>
          <Text style={styles.sectionSubtitle}>
            Based on feedback from your groups
          </Text>

          <View style={styles.traitList}>
            {topTraits.map((stat, index) => (
              <View key={stat.trait} style={styles.traitRow}>
                <View style={styles.traitInfo}>
                  <Text style={styles.traitRank}>#{index + 1}</Text>
                  <Text style={styles.traitName}>{stat.trait}</Text>
                </View>
                <View style={styles.traitStats}>
                  <View style={styles.progressBarContainer}>
                    <View
                      style={[styles.progressBar, { width: `${stat.percentage}%` }]}
                    />
                  </View>
                  <Text style={styles.traitCount}>{stat.count}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.privacyNote}>
          <Text style={styles.privacyNoteText}>
            All ratings are anonymous. Only aggregated statistics are shown.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
  },
  header: {
    marginBottom: spacing[6],
  },
  title: {
    ...typography.styles.h2,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  subtitle: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  overviewCard: {
    backgroundColor: colors.primary[600],
    borderRadius: borderRadius.xl,
    padding: spacing[6],
    alignItems: 'center',
    marginBottom: spacing[6],
    ...theme.shadows.lg,
  },
  overviewValue: {
    ...typography.styles.h1,
    color: colors.white,
    marginBottom: spacing[1],
  },
  overviewLabel: {
    ...typography.styles.body,
    color: colors.primary[100],
  },
  section: {
    marginBottom: spacing[6],
  },
  sectionTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  sectionSubtitle: {
    ...typography.styles.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing[4],
  },
  traitList: {
    gap: spacing[3],
  },
  traitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    padding: spacing[4],
    borderRadius: borderRadius.lg,
  },
  traitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 120,
  },
  traitRank: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    width: 28,
  },
  traitName: {
    ...typography.styles.body,
    color: colors.text.primary,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  traitStats: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: colors.gray[200],
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.full,
  },
  traitCount: {
    ...typography.styles.bodySmall,
    color: colors.text.secondary,
    width: 24,
    textAlign: 'right',
  },
  privacyNote: {
    backgroundColor: colors.background.tertiary,
    padding: spacing[4],
    borderRadius: borderRadius.lg,
  },
  privacyNoteText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
