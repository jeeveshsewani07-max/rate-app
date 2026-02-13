import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { apiClient } from '../api/client';
import { ENDPOINTS } from '../api/endpoints';
import {
  NotificationType,
  NotificationHandler,
  NotificationPreferences,
  DeviceToken,
} from './types';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

class NotificationService {
  private handlers: Map<NotificationType, NotificationHandler['handler']> = new Map();
  private expoPushToken: string | null = null;

  async initialize(): Promise<string | null> {
    try {
      if (!Device.isDevice) {
        console.log('Push notifications require a physical device');
        return null;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Push notification permission not granted');
        return null;
      }

      // Configure Android channel
      if (Platform.OS === 'android') {
        await this.setupAndroidChannels();
      }

      // Get Expo push token (may fail without valid EAS project ID)
      try {
        const tokenData = await Notifications.getExpoPushTokenAsync();
        this.expoPushToken = tokenData.data;
        return this.expoPushToken;
      } catch (tokenError) {
        console.warn('Failed to get push token (expected in dev):', tokenError);
        return null;
      }
    } catch (error) {
      console.warn('Notification initialization failed:', error);
      return null;
    }
  }

  private async setupAndroidChannels(): Promise<void> {
    await Notifications.setNotificationChannelAsync('daily_reminder', {
      name: 'Daily Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#6366F1',
    });

    await Notifications.setNotificationChannelAsync('new_rating', {
      name: 'New Ratings',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  async registerDeviceToken(): Promise<void> {
    if (!this.expoPushToken) {
      await this.initialize();
    }

    if (!this.expoPushToken) {
      return;
    }

    const deviceToken: DeviceToken = {
      token: this.expoPushToken,
      platform: Platform.OS as 'ios' | 'android',
      deviceId: Device.deviceName || 'unknown',
    };

    try {
      await apiClient.post(ENDPOINTS.NOTIFICATIONS.REGISTER_TOKEN, deviceToken);
    } catch (error) {
      console.error('Failed to register device token:', error);
    }
  }

  registerHandler(type: NotificationType, handler: NotificationHandler['handler']): void {
    this.handlers.set(type, handler);
  }

  unregisterHandler(type: NotificationType): void {
    this.handlers.delete(type);
  }

  setupNotificationListeners(
    onNotificationReceived: (notification: Notifications.Notification) => void,
    onNotificationResponse: (response: Notifications.NotificationResponse) => void
  ): () => void {
    const receivedSubscription = Notifications.addNotificationReceivedListener(
      onNotificationReceived
    );

    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        onNotificationResponse(response);

        // Handle notification based on type
        const data = response.notification.request.content.data;
        if (data?.type && this.handlers.has(data.type as NotificationType)) {
          const handler = this.handlers.get(data.type as NotificationType);
          handler?.(data as Record<string, unknown>);
        }
      }
    );

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }

  async getPreferences(): Promise<NotificationPreferences> {
    const response = await apiClient.get<{ data: NotificationPreferences }>(
      ENDPOINTS.NOTIFICATIONS.PREFERENCES
    );
    return response.data;
  }

  async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<void> {
    await apiClient.patch(ENDPOINTS.NOTIFICATIONS.PREFERENCES, preferences);
  }

  async scheduleDailyReminder(hour: number, minute: number): Promise<string> {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Daily Rating',
        body: "Don't forget to rate someone today!",
        data: { type: 'daily_reminder' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });

    return identifier;
  }

  async cancelScheduledNotification(identifier: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  }

  async cancelAllScheduledNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  async getBadgeCount(): Promise<number> {
    return await Notifications.getBadgeCountAsync();
  }

  async setBadgeCount(count: number): Promise<void> {
    await Notifications.setBadgeCountAsync(count);
  }

  async clearBadge(): Promise<void> {
    await Notifications.setBadgeCountAsync(0);
  }
}

export const notificationService = new NotificationService();
