module.exports = {
  expo: {
    name: 'RateApp',
    slug: 'rate-app',
    version: '1.0.0',
    entryPoint: './index.ts',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: false,
    scheme: 'rateapp',
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#6366F1',
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier: 'com.yourcompany.rateapp',
      buildNumber: '1',
      infoPlist: {
        NSCameraUsageDescription: 'RateApp needs camera access for profile photos.',
        NSPhotoLibraryUsageDescription: 'RateApp needs photo library access for profile photos.',
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#6366F1',
      },
      package: 'com.yourcompany.rateapp',
      versionCode: 1,
      permissions: ['NOTIFICATIONS', 'CAMERA', 'READ_EXTERNAL_STORAGE'],
    },
    web: {
      favicon: './assets/favicon.png',
      bundler: 'metro',
    },
    plugins: [
      'expo-dev-client',
      'expo-secure-store',
      [
        'expo-notifications',
        {
          icon: './assets/notification-icon.png',
          color: '#6366F1',
        },
      ],
    ],
    extra: {
      eas: {
        projectId: 'your-eas-project-id',
      },
    },
    // Explicitly disable Expo Router
    experiments: {
      typedRoutes: false,
    },
  },
};
