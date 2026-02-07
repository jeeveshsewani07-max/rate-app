import { useEffect, useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { notificationService } from './notificationService';
import { NotificationType } from './types';

export function useNotificationSetup() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);

  useEffect(() => {
    const setup = async () => {
      const token = await notificationService.initialize();
      setPermissionStatus(token ? 'granted' : 'denied');

      if (token) {
        await notificationService.registerDeviceToken();
      }

      setIsInitialized(true);
    };

    setup();
  }, []);

  return { isInitialized, permissionStatus };
}

export function useNotificationListeners() {
  const navigation = useNavigation();

  const handleNotificationReceived = useCallback(
    (notification: Notifications.Notification) => {
      console.log('Notification received:', notification);
    },
    []
  );

  const handleNotificationResponse = useCallback(
    (response: Notifications.NotificationResponse) => {
      const data = response.notification.request.content.data;

      switch (data?.type as NotificationType) {
        case 'new_rating_available':
          // Navigate to rating screen
          navigation.navigate('Main', {
            screen: 'HomeTab',
            params: {
              screen: 'Dashboard',
            },
          });
          break;

        case 'rating_received':
          // Navigate to analytics
          navigation.navigate('Main', {
            screen: 'AnalyticsTab',
            params: {
              screen: 'ProfileAnalytics',
            },
          });
          break;

        case 'group_invite':
          // Navigate to group join with invite code
          if (data?.groupId) {
            navigation.navigate('Auth', {
              screen: 'GroupJoin',
              params: { isOnboarding: false },
            });
          }
          break;

        default:
          break;
      }
    },
    [navigation]
  );

  useEffect(() => {
    const cleanup = notificationService.setupNotificationListeners(
      handleNotificationReceived,
      handleNotificationResponse
    );

    return cleanup;
  }, [handleNotificationReceived, handleNotificationResponse]);
}

export function useNotificationHandler(
  type: NotificationType,
  handler: (data: Record<string, unknown>) => void
) {
  useEffect(() => {
    notificationService.registerHandler(type, handler);

    return () => {
      notificationService.unregisterHandler(type);
    };
  }, [type, handler]);
}
