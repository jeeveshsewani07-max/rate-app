export const TRAITS = {
  POSITIVE: [
    'helpful',
    'creative',
    'reliable',
    'friendly',
    'hardworking',
    'supportive',
    'organized',
    'communicative',
    'resourceful',
    'enthusiastic',
  ],
  NEUTRAL: [
    'quiet',
    'independent',
    'cautious',
    'detail-oriented',
    'reserved',
    'analytical',
    'traditional',
    'practical',
  ],
} as const;

export const ALL_TRAITS = [...TRAITS.POSITIVE, ...TRAITS.NEUTRAL];

export const LIMITS = {
  MAX_TRAITS_PER_RATING: 5,
  MIN_TRAITS_PER_RATING: 1,
  RATING_COOLDOWN_HOURS: 24,
  ASSIGNMENT_EXPIRY_HOURS: 24,
  RECENT_TARGET_WINDOW_DAYS: 7,
  MAX_GROUPS_PER_USER: 10,
  MIN_GROUP_SIZE: 3,
  DEFAULT_PAGE_SIZE: 20,
} as const;
