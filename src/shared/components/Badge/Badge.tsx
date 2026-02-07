import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../theme';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
}

const VARIANT_STYLES: Record<BadgeVariant, { bg: string; text: string }> = {
  primary: { bg: colors.primary[100], text: colors.primary[700] },
  secondary: { bg: colors.gray[100], text: colors.gray[700] },
  success: { bg: colors.success.light, text: colors.success.dark },
  warning: { bg: colors.warning.light, text: colors.warning.dark },
  error: { bg: colors.error.light, text: colors.error.dark },
  neutral: { bg: colors.gray[200], text: colors.gray[600] },
};

export function Badge({ label, variant = 'primary', size = 'md', style }: BadgeProps) {
  const variantStyle = VARIANT_STYLES[variant];

  return (
    <View
      style={[
        styles.container,
        styles[size],
        { backgroundColor: variantStyle.bg },
        style,
      ]}
    >
      <Text style={[styles.text, styles[`text_${size}`], { color: variantStyle.text }]}>
        {label}
      </Text>
    </View>
  );
}

// Notification dot badge
export function NotificationBadge({
  count,
  max = 99,
  style,
}: {
  count: number;
  max?: number;
  style?: ViewStyle;
}) {
  if (count <= 0) return null;

  const displayCount = count > max ? `${max}+` : count.toString();

  return (
    <View style={[styles.notificationBadge, style]}>
      <Text style={styles.notificationText}>{displayCount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    borderRadius: borderRadius.full,
  },
  sm: {
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
  },
  md: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  text: {
    fontWeight: '500',
  },
  text_sm: {
    fontSize: 10,
  },
  text_md: {
    fontSize: 12,
  },
  notificationBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.error.main,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  notificationText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
});
