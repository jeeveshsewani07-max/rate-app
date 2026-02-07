import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '../types';
import { SettingsScreen } from '../../features/settings/screens/SettingsScreen';
import { DeleteAccountScreen } from '../../features/settings/screens/DeleteAccountScreen';
import { GroupJoinScreen } from '../../features/groups/screens/GroupJoinScreen';
import { colors } from '../../shared/theme';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export function SettingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.background.primary },
        headerTintColor: colors.text.primary,
        contentStyle: { backgroundColor: colors.background.primary },
      }}
    >
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      <Stack.Screen
        name="DeleteAccount"
        component={DeleteAccountScreen}
        options={{
          title: 'Delete Account',
          headerTintColor: colors.error.main,
        }}
      />
      <Stack.Screen
        name="GroupJoin"
        component={GroupJoinScreen}
        options={{ title: 'Join Groups' }}
      />
    </Stack.Navigator>
  );
}
