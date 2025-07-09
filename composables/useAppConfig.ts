import { useRuntimeConfig } from '#app';

export interface ApiConfig {
  environment: string;
  baseURL: string;
  useMock: boolean;
  timeout: number;
}

export interface AppConfig {
  api: ApiConfig;
  app: {
    name: string;
    version: string;
    debug: boolean;
  };
}

export const useProjectConfig = (): AppConfig => {
  const config = useRuntimeConfig();

  return {
    api: {
      environment: String(config.public.apiEnv || 'development'),
      baseURL: String(config.public.apiBaseUrl || '/mock'),
      useMock: Boolean(config.public.apiUseMock),
      timeout: Number(config.public.apiTimeout || 5000),
    },
    app: {
      name: String(config.public.appName || 'Nuxt Service Demo'),
      version: String(config.public.appVersion || '1.0.0'),
      debug: Boolean(config.public.appDebug),
    },
  };
};

// API 配置專用函數
export const useApiConfig = (): ApiConfig => {
  const projectConfig = useProjectConfig();
  return projectConfig.api;
};
