import { useState, useEffect, useCallback } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

interface NetworkStatus {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  type: string | null;
  isLoading: boolean;
}

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    isConnected: null,
    isInternetReachable: null,
    type: null,
    isLoading: true,
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setStatus({
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
        isLoading: false,
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return status;
}

export function useIsOnline(): boolean {
  const { isConnected, isInternetReachable } = useNetworkStatus();
  return isConnected === true && isInternetReachable !== false;
}

export function useRefreshOnReconnect(callback: () => void) {
  const wasOffline = useCallback(() => {
    let previouslyOffline = false;

    return (isOnline: boolean) => {
      if (previouslyOffline && isOnline) {
        callback();
      }
      previouslyOffline = !isOnline;
    };
  }, [callback]);

  const isOnline = useIsOnline();
  const checkReconnection = wasOffline();

  useEffect(() => {
    checkReconnection(isOnline);
  }, [isOnline, checkReconnection]);
}
