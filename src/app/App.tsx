import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryProvider } from './providers/QueryProvider';
import { NavigationProvider } from './providers/NavigationProvider';
import { RootNavigator } from '../navigation/RootNavigator';
import { ErrorBoundary } from '../shared/components';
import { useNotificationSetup, useNotificationListeners } from '../core/notifications';
import { useOfflineSync } from '../features/rating/hooks/useOfflineSync';

function AppContent() {
  // Initialize push notifications
  useNotificationSetup();
  useNotificationListeners();

  // Start offline sync service
  const { pendingCount } = useOfflineSync();

  useEffect(() => {
    if (pendingCount > 0) {
      console.log(`${pendingCount} ratings pending sync`);
    }
  }, [pendingCount]);

  return (
    <>
      <StatusBar style="auto" />
      <RootNavigator />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <QueryProvider>
          <NavigationProvider>
            <AppContent />
          </NavigationProvider>
        </QueryProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
