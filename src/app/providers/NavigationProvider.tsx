import React, { ReactNode } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { linking } from '../../navigation/linking';

interface NavigationProviderProps {
  children: ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  return (
    <NavigationContainer linking={linking}>
      {children}
    </NavigationContainer>
  );
}
