import { useRuntimeConfig } from '#app';
import { ProjectConfigSchema } from '~/service/schema/config';
import { validateSchema } from '~/service/schema/common';
import type { ProjectConfigType } from '~/service/schema/config';

// 統一配置函數 - 扁平化設計
export const useProjectConfig = (): ProjectConfigType => {
  const config = useRuntimeConfig();

  const rawConfig = {
    // API 相關配置
    environment: String(config.public.apiEnv || 'development'),
    baseURL: String(config.public.apiBaseUrl || '/mock'),
    useMock: Boolean(config.public.apiUseMock),
    timeout: Number(config.public.apiTimeout || 5000),

    // 應用程式相關配置
    appName: String(config.public.appName || 'Nuxt Service Demo'),
    appVersion: String(config.public.appVersion || '1.0.0'),
    appDebug: Boolean(config.public.appDebug),
  };

  // 使用 Zod 驗證
  return validateSchema(ProjectConfigSchema, rawConfig, 'Config配置');
};
