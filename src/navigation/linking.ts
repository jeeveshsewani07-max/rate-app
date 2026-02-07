import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from './types';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['rateapp://', 'https://rateapp.com'],
  config: {
    screens: {
      Auth: {
        screens: {
          Splash: 'splash',
          Login: 'login',
          Register: 'register',
          GroupJoin: 'join/:groupId?',
        },
      },
      Main: {
        screens: {
          HomeTab: {
            screens: {
              Dashboard: 'home',
              RatingCard: 'rate/:assignmentId',
            },
          },
          AnalyticsTab: {
            screens: {
              ProfileAnalytics: 'analytics',
            },
          },
          SettingsTab: {
            screens: {
              Settings: 'settings',
              DeleteAccount: 'settings/delete',
            },
          },
        },
      },
    },
  },
};
