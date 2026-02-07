import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import { colors } from '../../theme';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  source?: string | null;
  name?: string;
  size?: AvatarSize;
  style?: ViewStyle;
}

const SIZES: Record<AvatarSize, { container: number; text: number }> = {
  xs: { container: 24, text: 10 },
  sm: { container: 32, text: 12 },
  md: { container: 48, text: 16 },
  lg: { container: 64, text: 20 },
  xl: { container: 96, text: 32 },
};

const COLORS = [
  colors.primary[500],
  colors.success.main,
  colors.warning.main,
  '#EC4899', // Pink
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#F97316', // Orange
];

function getColorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({ source, name = '', size = 'md', style }: AvatarProps) {
  const dimensions = SIZES[size];
  const backgroundColor = getColorFromName(name);
  const initials = getInitials(name);

  const containerStyle: ViewStyle = {
    width: dimensions.container,
    height: dimensions.container,
    borderRadius: dimensions.container / 2,
  };

  const imageStyle: ImageStyle = {
    width: dimensions.container,
    height: dimensions.container,
    borderRadius: dimensions.container / 2,
    resizeMode: 'cover',
  };

  if (source) {
    return (
      <Image
        source={{ uri: source }}
        style={[imageStyle, style as ImageStyle]}
      />
    );
  }

  return (
    <View style={[styles.container, containerStyle, { backgroundColor }, style]}>
      <Text style={[styles.initials, { fontSize: dimensions.text }]}>
        {initials || '?'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: colors.white,
    fontWeight: '600',
  },
});
