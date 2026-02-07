import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDeleteAccount } from '../../auth/hooks/useAuth';
import { colors, spacing, typography, borderRadius } from '../../../shared/theme';

const CONFIRMATION_TEXT = 'DELETE';

export function DeleteAccountScreen() {
  const [confirmText, setConfirmText] = useState('');
  const deleteAccountMutation = useDeleteAccount();

  const isConfirmed = confirmText.toUpperCase() === CONFIRMATION_TEXT;

  const handleDelete = () => {
    if (!isConfirmed) return;

    Alert.alert(
      'Final Confirmation',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Forever',
          style: 'destructive',
          onPress: () => deleteAccountMutation.mutate(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        <View style={styles.warningCard}>
          <Text style={styles.warningTitle}>Delete Your Account</Text>
          <Text style={styles.warningText}>
            This will permanently delete your account and all associated data:
          </Text>
          <View style={styles.warningList}>
            <Text style={styles.warningListItem}>• All ratings you've given</Text>
            <Text style={styles.warningListItem}>• All ratings you've received</Text>
            <Text style={styles.warningListItem}>• Your profile and preferences</Text>
            <Text style={styles.warningListItem}>• Group memberships</Text>
          </View>
          <Text style={styles.warningNote}>
            This action cannot be undone.
          </Text>
        </View>

        <View style={styles.confirmSection}>
          <Text style={styles.confirmLabel}>
            Type <Text style={styles.confirmHighlight}>{CONFIRMATION_TEXT}</Text> to confirm
          </Text>
          <TextInput
            style={styles.confirmInput}
            value={confirmText}
            onChangeText={setConfirmText}
            placeholder={CONFIRMATION_TEXT}
            placeholderTextColor={colors.text.tertiary}
            autoCapitalize="characters"
            autoCorrect={false}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.deleteButton,
            !isConfirmed && styles.deleteButtonDisabled,
          ]}
          onPress={handleDelete}
          disabled={!isConfirmed || deleteAccountMutation.isPending}
        >
          {deleteAccountMutation.isPending ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.deleteButtonText}>Delete Account</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
  },
  warningCard: {
    backgroundColor: colors.error.light,
    borderRadius: borderRadius.lg,
    padding: spacing[5],
    marginBottom: spacing[6],
  },
  warningTitle: {
    ...typography.styles.h4,
    color: colors.error.dark,
    marginBottom: spacing[3],
  },
  warningText: {
    ...typography.styles.body,
    color: colors.error.dark,
    marginBottom: spacing[3],
  },
  warningList: {
    marginBottom: spacing[3],
  },
  warningListItem: {
    ...typography.styles.bodySmall,
    color: colors.error.dark,
    marginBottom: spacing[1],
  },
  warningNote: {
    ...typography.styles.bodySmall,
    color: colors.error.dark,
    fontWeight: '600',
  },
  confirmSection: {
    gap: spacing[3],
  },
  confirmLabel: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  confirmHighlight: {
    fontWeight: '700',
    color: colors.error.main,
  },
  confirmInput: {
    height: 52,
    borderWidth: 2,
    borderColor: colors.error.main,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing[4],
    ...typography.styles.body,
    color: colors.text.primary,
    textAlign: 'center',
    letterSpacing: 2,
  },
  footer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
  },
  deleteButton: {
    height: 52,
    backgroundColor: colors.error.main,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonDisabled: {
    backgroundColor: colors.gray[300],
  },
  deleteButtonText: {
    ...typography.styles.button,
    color: colors.white,
  },
});
