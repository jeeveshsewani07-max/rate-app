import Constants from 'expo-constants';

interface EnvConfig {
  apiBaseUrl: string;
  appEnv: 'development' | 'staging' | 'production';
  enableMockApi: boolean;
  queryStaleTime: number;
  queryCacheTime: number;
}

const ENV: Record<string, EnvConfig> = {
  development: {
    apiBaseUrl: 'http://localhost:3000/api/v1',
    appEnv: 'development',
    enableMockApi: true,
    queryStaleTime: 1000 * 60 * 5, // 5 minutes
    queryCacheTime: 1000 * 60 * 30, // 30 minutes
  },
  staging: {
    apiBaseUrl: 'https://staging-api.rateapp.com/api/v1',
    appEnv: 'staging',
    enableMockApi: false,
    queryStaleTime: 1000 * 60 * 5,
    queryCacheTime: 1000 * 60 * 30,
  },
  production: {
    apiBaseUrl: 'https://api.rateapp.com/api/v1',
    appEnv: 'production',
    enableMockApi: false,
    queryStaleTime: 1000 * 60 * 5,
    queryCacheTime: 1000 * 60 * 30,
  },
};

const getEnvVars = (): EnvConfig => {
  const releaseChannel = Constants.expoConfig?.extra?.releaseChannel ?? 'development';
  return ENV[releaseChannel] ?? ENV.development;
};

export const env = getEnvVars();
