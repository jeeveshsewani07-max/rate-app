export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    DELETE_ACCOUNT: '/auth/delete',
  },

  // Groups
  GROUPS: {
    LIST: '/groups',
    SEARCH: '/groups/search',
    JOIN: (groupId: string) => `/groups/${groupId}/join`,
    LEAVE: (groupId: string) => `/groups/${groupId}/leave`,
    MEMBERS: (groupId: string) => `/groups/${groupId}/members`,
  },

  // Ratings
  RATINGS: {
    DAILY_ASSIGNMENT: '/ratings/assignment',
    SUBMIT: '/ratings',
    HISTORY: '/ratings/history',
    PENDING: '/ratings/pending',
  },

  // Analytics
  ANALYTICS: {
    PROFILE: '/analytics/profile',
    TRAITS: '/analytics/traits',
    TRENDS: '/analytics/trends',
  },

  // Notifications
  NOTIFICATIONS: {
    REGISTER_TOKEN: '/notifications/register',
    PREFERENCES: '/notifications/preferences',
  },
} as const;
