import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '../../../navigation/types';
import { useLogout, useCurrentUser } from '../../auth/hooks/useAuth';
import { notificationService } from '../../../core/notifications/notificationService';
import { colors, spacing, typography, borderRadius } from '../../../shared/theme';

type SettingsNavigationProp = NativeStackNavigationProp<SettingsStackParamList, 'Settings'>;

interface SettingRowProps {
  label: string;
  value?: string;
  onPress?: () => void;
  isDestructive?: boolean;
  rightElement?: React.ReactNode;
}

function SettingRow({ label, value, onPress, isDestructive, rightElement }: SettingRowProps) {
  return (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      disabled={!onPress}
    >
      <Text style={[styles.settingLabel, isDestructive && styles.destructiveText]}>
        {label}
      </Text>
      {rightElement ?? (
        <Text style={styles.settingValue}>{value}</Text>
      )}
    </TouchableOpacity>
  );
}

export function SettingsScreen() {
  const navigation = useNavigation<SettingsNavigationProp>();
  const user = useCurrentUser();
  const logoutMutation = useLogout();

  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const handleToggleNotifications = (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    notificationService.updatePreferences({ dailyReminder: enabled }).catch(() => {
      // Revert on failure
      setNotificationsEnabled(!enabled);
    });
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => logoutMutation.mutate(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.sectionContent}>
          <SettingRow label="Email" value={user?.email} />
          <SettingRow label="Display Name" value={user?.displayName} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.sectionContent}>
          <SettingRow
            label="Push Notifications"
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={handleToggleNotifications}
                trackColor={{ true: colors.primary[500] }}
              />
            }
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Groups</Text>
        <View style={styles.sectionContent}>
          <SettingRow
            label="My Groups"
            value={`${user?.groupIds.length ?? 0} joined`}
            onPress={() => navigation.navigate('GroupJoin')}
          />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionContent}>
          <SettingRow label="Sign Out" onPress={handleLogout} isDestructive />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionContent}>
          <SettingRow
            label="Delete Account"
            onPress={() => navigation.navigate('DeleteAccount')}
            isDestructive
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>RateApp v1.0.0</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  section: {
    marginTop: spacing[6],
  },
  sectionTitle: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing[2],
    marginHorizontal: spacing[4],
  },
  sectionContent: {
    backgroundColor: colors.background.primary,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border.light,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  settingLabel: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  settingValue: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  destructiveText: {
    color: colors.error.main,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: spacing[6],
  },
  footerText: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
  },
});
