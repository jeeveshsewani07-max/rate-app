import { apiClient } from '../../../core/api/client';
import { ENDPOINTS } from '../../../core/api/endpoints';
import { Group, GroupSearchResult, GroupMember } from '../types';

interface ApiDataResponse<T> {
  data: T;
}

export const groupService = {
  async getMyGroups(): Promise<Group[]> {
    const response = await apiClient.get<ApiDataResponse<Group[]>>(
      ENDPOINTS.GROUPS.LIST
    );
    return response.data;
  },

  async searchGroups(
    query: string,
    page: number = 1,
    limit: number = 20
  ): Promise<GroupSearchResult> {
    const response = await apiClient.get<ApiDataResponse<GroupSearchResult>>(
      ENDPOINTS.GROUPS.SEARCH,
      { params: { q: query, page, limit } }
    );
    return response.data;
  },

  async joinGroup(groupId: string, inviteCode?: string): Promise<Group> {
    const response = await apiClient.post<ApiDataResponse<Group>>(
      ENDPOINTS.GROUPS.JOIN(groupId),
      { inviteCode }
    );
    return response.data;
  },

  async leaveGroup(groupId: string): Promise<void> {
    await apiClient.post(ENDPOINTS.GROUPS.LEAVE(groupId));
  },

  async getGroupMembers(
    groupId: string,
    page: number = 1
  ): Promise<{ members: GroupMember[]; total: number }> {
    const response = await apiClient.get<
      ApiDataResponse<{ members: GroupMember[]; total: number }>
    >(ENDPOINTS.GROUPS.MEMBERS(groupId), { params: { page } });
    return response.data;
  },
};
