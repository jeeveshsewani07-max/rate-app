import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export function useAppState() {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      appState.current = nextAppState;
      setAppStateVisible(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return {
    appState: appStateVisible,
    isActive: appStateVisible === 'active',
    isBackground: appStateVisible === 'background',
    isInactive: appStateVisible === 'inactive',
  };
}

export function useOnAppStateChange(
  callback: (state: AppStateStatus, previousState: AppStateStatus) => void
) {
  const previousState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      callback(nextAppState, previousState.current);
      previousState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [callback]);
}

export function useOnForeground(callback: () => void) {
  const previousState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        previousState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        callback();
      }
      previousState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [callback]);
}

export function useOnBackground(callback: () => void) {
  const previousState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        previousState.current === 'active' &&
        nextAppState.match(/inactive|background/)
      ) {
        callback();
      }
      previousState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [callback]);
}
