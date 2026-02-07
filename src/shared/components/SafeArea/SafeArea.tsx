import React from 'react';
import { View, StyleSheet, ViewStyle, StatusBar, Platform } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
  Edge,
} from 'react-native-safe-area-context';
import { colors } from '../../theme';

interface SafeAreaProps {
  children: React.ReactNode;
  edges?: Edge[];
  style?: ViewStyle;
  backgroundColor?: string;
}

export function ScreenContainer({
  children,
  edges = ['top', 'bottom'],
  style,
  backgroundColor = colors.background.primary,
}: SafeAreaProps) {
  return (
    <SafeAreaView
      edges={edges}
      style={[styles.container, { backgroundColor }, style]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={backgroundColor}
      />
      {children}
    </SafeAreaView>
  );
}

export function KeyboardAvoidingContainer({
  children,
  style,
  backgroundColor = colors.background.primary,
}: Omit<SafeAreaProps, 'edges'>) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

// Hook for manual inset usage
export function useSafeInsets() {
  const insets = useSafeAreaInsets();

  return {
    ...insets,
    // Add status bar height for Android
    topWithStatusBar:
      Platform.OS === 'android'
        ? insets.top + (StatusBar.currentHeight || 0)
        : insets.top,
  };
}

// Spacer component that respects safe area
export function SafeAreaSpacer({
  position,
}: {
  position: 'top' | 'bottom';
}) {
  const insets = useSafeAreaInsets();
  const height = position === 'top' ? insets.top : insets.bottom;

  return <View style={{ height }} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
