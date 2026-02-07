export interface Group {
  id: string;
  name: string;
  description?: string;
  category: GroupCategory;
  memberCount: number;
  createdAt: string;
  isJoined: boolean;
}

export type GroupCategory =
  | 'academic'
  | 'housing'
  | 'study'
  | 'club'
  | 'sports'
  | 'other';

export interface GroupMember {
  id: string;
  displayName: string;
  joinedAt: string;
}

export interface GroupSearchResult {
  groups: Group[];
  total: number;
  hasMore: boolean;
}

export interface JoinGroupRequest {
  groupId: string;
  inviteCode?: string;
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
  category: GroupCategory;
}
