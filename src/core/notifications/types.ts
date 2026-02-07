export interface PushNotificationPayload {
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

export type NotificationType =
  | 'daily_reminder'
  | 'new_rating_available'
  | 'rating_received'
  | 'group_invite';

export interface NotificationPreferences {
  dailyReminder: boolean;
  dailyReminderTime: string; // HH:mm format
  newRatingAlert: boolean;
  ratingReceivedAlert: boolean;
}

export interface NotificationHandler {
  type: NotificationType;
  handler: (data: Record<string, unknown>) => void;
}

export interface DeviceToken {
  token: string;
  platform: 'ios' | 'android' | 'web';
  deviceId: string;
}
