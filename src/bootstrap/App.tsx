import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryProvider } from './providers/QueryProvider';
import { NavigationProvider } from './providers/NavigationProvider';
import { RootNavigator } from '../navigation/RootNavigator';
import { ErrorBoundary } from '../shared/components';

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <QueryProvider>
          <NavigationProvider>
            <StatusBar style="auto" />
            <RootNavigator />
          </NavigationProvider>
        </QueryProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
