import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AnalyticsStackParamList } from '../types';
import { ProfileAnalyticsScreen } from '../../features/analytics/screens/ProfileAnalyticsScreen';
import { colors } from '../../shared/theme';

const Stack = createNativeStackNavigator<AnalyticsStackParamList>();

export function AnalyticsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background.primary },
      }}
    >
      <Stack.Screen name="ProfileAnalytics" component={ProfileAnalyticsScreen} />
    </Stack.Navigator>
  );
}
