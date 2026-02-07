import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { HomeStackParamList } from '../../../navigation/types';
import { useSubmitRating } from '../hooks/useDailyAssignment';
import { TRAIT_CATEGORIES, Trait, APP_CONFIG } from '../../../app/config/constants';
import { colors, spacing, typography, borderRadius } from '../../../shared/theme';

type RatingCardRouteProp = RouteProp<HomeStackParamList, 'RatingCard'>;

export function RatingCardScreen() {
  const navigation = useNavigation();
  const route = useRoute<RatingCardRouteProp>();
  const { assignmentId } = route.params;

  const [selectedTraits, setSelectedTraits] = useState<Trait[]>([]);
  const submitRating = useSubmitRating();

  const toggleTrait = (trait: Trait) => {
    setSelectedTraits((prev) => {
      if (prev.includes(trait)) {
        return prev.filter((t) => t !== trait);
      }
      if (prev.length >= APP_CONFIG.MAX_TRAITS_PER_RATING) {
        return prev;
      }
      return [...prev, trait];
    });
  };

  const handleSubmit = () => {
    if (selectedTraits.length < APP_CONFIG.MIN_TRAITS_PER_RATING) {
      return;
    }

    submitRating.mutate(
      { assignmentId, traits: selectedTraits },
      {
        onSuccess: (result) => {
          if (result.queued) {
            Alert.alert('Queued', 'Your rating will be submitted when you are back online.', [
              { text: 'OK', onPress: () => navigation.goBack() },
            ]);
          } else {
            navigation.goBack();
          }
        },
        onError: () => {
          Alert.alert('Error', 'Failed to submit rating. Please try again.');
        },
      }
    );
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const canSubmit =
    selectedTraits.length >= APP_CONFIG.MIN_TRAITS_PER_RATING &&
    selectedTraits.length <= APP_CONFIG.MAX_TRAITS_PER_RATING;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rate Profile</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>?</Text>
        </View>
        <Text style={styles.profileName}>Anonymous Profile</Text>
        <Text style={styles.profileHint}>
          Select {APP_CONFIG.MIN_TRAITS_PER_RATING}-{APP_CONFIG.MAX_TRAITS_PER_RATING} traits that describe this person
        </Text>
      </View>

      <ScrollView style={styles.traitsContainer} contentContainerStyle={styles.traitsContent}>
        <Text style={styles.sectionLabel}>Positive Traits</Text>
        <View style={styles.traitGrid}>
          {TRAIT_CATEGORIES.POSITIVE.map((trait) => (
            <TouchableOpacity
              key={trait}
              style={[
                styles.traitChip,
                selectedTraits.includes(trait) && styles.traitChipSelected,
              ]}
              onPress={() => toggleTrait(trait)}
            >
              <Text
                style={[
                  styles.traitChipText,
                  selectedTraits.includes(trait) && styles.traitChipTextSelected,
                ]}
              >
                {trait}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Neutral Traits</Text>
        <View style={styles.traitGrid}>
          {TRAIT_CATEGORIES.NEUTRAL.map((trait) => (
            <TouchableOpacity
              key={trait}
              style={[
                styles.traitChip,
                selectedTraits.includes(trait) && styles.traitChipSelected,
              ]}
              onPress={() => toggleTrait(trait)}
            >
              <Text
                style={[
                  styles.traitChipText,
                  selectedTraits.includes(trait) && styles.traitChipTextSelected,
                ]}
              >
                {trait}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.selectionCount}>
          {selectedTraits.length} / {APP_CONFIG.MAX_TRAITS_PER_RATING} selected
        </Text>
        <TouchableOpacity
          style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit || submitRating.isPending}
        >
          {submitRating.isPending ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.submitButtonText}>Submit Rating</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  closeButton: {
    padding: spacing[2],
  },
  closeButtonText: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  headerTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
  },
  headerSpacer: {
    width: 60,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: spacing[6],
    paddingHorizontal: spacing[4],
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  avatarText: {
    ...typography.styles.h2,
    color: colors.gray[400],
  },
  profileName: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  profileHint: {
    ...typography.styles.bodySmall,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  traitsContainer: {
    flex: 1,
  },
  traitsContent: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[6],
  },
  sectionLabel: {
    ...typography.styles.bodySmall,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: spacing[3],
    marginTop: spacing[4],
  },
  traitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  traitChip: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  traitChipSelected: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[600],
  },
  traitChipText: {
    ...typography.styles.bodySmall,
    color: colors.text.primary,
  },
  traitChipTextSelected: {
    color: colors.white,
  },
  footer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    backgroundColor: colors.background.primary,
  },
  selectionCount: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing[3],
  },
  submitButton: {
    height: 52,
    backgroundColor: colors.primary[600],
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: colors.gray[300],
  },
  submitButtonText: {
    ...typography.styles.button,
    color: colors.white,
  },
});
