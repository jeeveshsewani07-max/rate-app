import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupService } from '../services/groupService';
import { useAuthStore } from '../../auth/store/authStore';

export function useMyGroups() {
  return useQuery({
    queryKey: ['groups', 'my'],
    queryFn: () => groupService.getMyGroups(),
  });
}

export function useSearchGroups(query: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['groups', 'search', query],
    queryFn: () => groupService.searchGroups(query),
    enabled: enabled && query.length >= 2,
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useJoinGroup() {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: ({ groupId, inviteCode }: { groupId: string; inviteCode?: string }) =>
      groupService.joinGroup(groupId, inviteCode),
    onSuccess: (group) => {
      // Update local user state
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        updateUser({
          groupIds: [...currentUser.groupIds, group.id],
        });
      }

      // Invalidate groups queries
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      // Invalidate assignment since new group may have new assignments
      queryClient.invalidateQueries({ queryKey: ['daily-assignment'] });
    },
  });
}

export function useLeaveGroup() {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: (groupId: string) => groupService.leaveGroup(groupId),
    onSuccess: (_, groupId) => {
      // Update local user state
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        updateUser({
          groupIds: currentUser.groupIds.filter((id) => id !== groupId),
        });
      }

      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}

export function useGroupMembers(groupId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['groups', groupId, 'members'],
    queryFn: () => groupService.getGroupMembers(groupId),
    enabled,
  });
}
