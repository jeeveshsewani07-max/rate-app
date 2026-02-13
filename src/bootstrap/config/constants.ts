export const APP_CONFIG = {
  APP_NAME: 'RateApp',
  VERSION: '1.0.0',

  // Rating system
  MAX_TRAITS_PER_RATING: 5,
  MIN_TRAITS_PER_RATING: 1,
  RATING_COOLDOWN_HOURS: 24,

  // Groups
  MIN_GROUP_SIZE: 3,
  MAX_GROUPS_PER_USER: 10,

  // API
  REQUEST_TIMEOUT_MS: 30000,
  MAX_RETRY_ATTEMPTS: 3,

  // Storage keys
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_ID: 'user_id',
    ONBOARDING_COMPLETE: 'onboarding_complete',
    PENDING_RATINGS: 'pending_ratings',
    LAST_SYNC: 'last_sync',
  },

  // Push notification channels
  NOTIFICATION_CHANNELS: {
    DAILY_REMINDER: 'daily_reminder',
    NEW_RATING: 'new_rating',
  },
} as const;

export const TRAIT_CATEGORIES = {
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

export type PositiveTrait = typeof TRAIT_CATEGORIES.POSITIVE[number];
export type NeutralTrait = typeof TRAIT_CATEGORIES.NEUTRAL[number];
export type Trait = PositiveTrait | NeutralTrait;
