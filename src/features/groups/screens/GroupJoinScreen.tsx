import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSearchGroups, useJoinGroup } from '../hooks/useGroups';
import { Group } from '../types';
import { colors, spacing, typography, borderRadius } from '../../../shared/theme';

export function GroupJoinScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [joiningId, setJoiningId] = useState<string | null>(null);

  const searchEnabled = searchQuery.length >= 2;
  const { data: searchResult, isLoading } = useSearchGroups(searchQuery, searchEnabled);
  const joinGroup = useJoinGroup();

  const groups = searchResult?.groups ?? [];

  const handleJoinGroup = (groupId: string) => {
    setJoiningId(groupId);
    joinGroup.mutate({ groupId }, {
      onSuccess: () => {
        setJoiningId(null);
        Alert.alert('Joined', 'You have successfully joined the group.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      },
      onError: () => {
        setJoiningId(null);
        Alert.alert('Error', 'Failed to join group. Please try again.');
      },
    });
  };

  const renderGroupItem = ({ item }: { item: Group }) => (
    <View style={styles.groupCard}>
      <View style={styles.groupInfo}>
        <Text style={styles.groupName}>{item.name}</Text>
        <Text style={styles.groupMeta}>
          {item.category} • {item.memberCount} members
        </Text>
      </View>
      {item.isJoined ? (
        <View style={styles.joinedBadge}>
          <Text style={styles.joinedBadgeText}>Joined</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.joinButton, joiningId === item.id && styles.joinButtonDisabled]}
          onPress={() => handleJoinGroup(item.id)}
          disabled={joiningId !== null}
        >
          {joiningId === item.id ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={styles.joinButtonText}>Join</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEmpty = () => {
    if (!searchEnabled) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Search for groups to join</Text>
          <Text style={styles.emptyHint}>Type at least 2 characters</Text>
        </View>
      );
    }

    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No groups found</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search groups..."
          placeholderTextColor={colors.text.tertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {isLoading && searchEnabled ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      ) : (
        <FlatList
          data={groups}
          renderItem={renderGroupItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmpty}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  searchContainer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  searchInput: {
    height: 44,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing[4],
    ...typography.styles.body,
    color: colors.text.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: spacing[4],
    gap: spacing[3],
  },
  groupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    padding: spacing[4],
    borderRadius: borderRadius.lg,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    ...typography.styles.body,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  groupMeta: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  joinButton: {
    backgroundColor: colors.primary[600],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.md,
    minWidth: 70,
    alignItems: 'center',
  },
  joinButtonDisabled: {
    opacity: 0.7,
  },
  joinButtonText: {
    ...typography.styles.button,
    color: colors.white,
    fontSize: 14,
  },
  joinedBadge: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary[600],
    minWidth: 70,
    alignItems: 'center',
  },
  joinedBadgeText: {
    ...typography.styles.button,
    color: colors.primary[600],
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing[10],
  },
  emptyText: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  emptyHint: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    marginTop: spacing[1],
  },
});
